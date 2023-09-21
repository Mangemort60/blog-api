const s3 = require('../config/aws-config');
const {
  User,
  registerValidationSchema,
  loginValidationSchema,
} = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const formidable = require('formidable');
const fs = require('fs');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { log } = require('console');
const private_key = process.env.PRIVATE_KEY;

const userController = {
  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        console.log('User non trouvé.');
        return res.status(404).send('User non trouvé');
      }
      const user = await User.findById(userId).populate('post');

      logger.info(`Utilisateur ${user} récupéré avec succès`);
      return res.status(200).json({ message: 'User récupéré', user });
    } catch (error) {
      logger.error("Erreur lors de la récupération d'un utilisateur");
      console.log(error);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      logger.info(`Utilisateurs récupérés avec succès`);
      return res.status(200).json({ message: 'Users récupéré', users });
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs');
      console.log(error);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  register: async (req, res) => {
    try {
      const { error } = registerValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        logger.warn(
          "Échec de la validation lors de la création d'un nouvel utilisateur"
        );
        return res.status(400).send(error.message);
      }
      const password = req.body.password;
      const hash = await bcrypt.hash(password, 10);
      const newUser = { ...req.body, password: hash };
      const createdUser = await User.create(newUser);

      logger.info(`Utilisateur ${createdUser.email} créé avec succès`);
      res.status(200).json({
        message: `user ${createdUser.email} a bien été crée`,
      });
    } catch (error) {
      logger.error("Erreur lors de la création d'un nouvel utilisateur");
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  uploadHeadshot: async (req, res) => {
    console.log('Début de la fonction uploadImage.');

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      console.log('Formidable a terminé le parsing.');

      if (err) {
        console.log('Erreur pendant le parsing: ', err);
        return res.status(400).json({ error: err.message });
      }

      const fileName = files.img[0].originalFilename;
      const fileType = files.img[0].mimetype;
      console.log(`Nom de fichier: ${fileName}, Type de fichier: ${fileType}`);

      const fileStream = fs.createReadStream(files.img[0].filepath);
      console.log('Flux de fichier créé.');

      const params = {
        Bucket: 'blog.mern',
        Key: `${fileName}-${Date.now()}`,
        Body: fileStream,
        ContentType: fileType,
      };

      try {
        console.log("Tentative d'upload sur S3.");
        const uploadResult = await s3.send(new PutObjectCommand(params));
        console.log('Upload réussi. Résultat: ', uploadResult);

        const userId = req.params.id;
        console.log(`Recherche du user avec l'ID: ${userId}`);

        const user = await User.findById(userId);
        if (!user) {
          console.log('User non trouvé.');
          return res.status(404).send('User non trouvé');
        }
        console.log('Post trouvé.');
        const imageUrl = `https://${params.Bucket}.s3.eu-west-3.amazonaws.com/${params.Key}`;
        user.headshot = imageUrl;
        await user.save();
        console.log('Image URL sauvegardée dans le post.');

        res.send({
          message: 'Upload réussi',
          imageUrl: uploadResult.Location,
        });
      } catch (error) {
        console.log(
          "Erreur pendant l'upload ou la sauvegarde du post: ",
          error
        );
        res.status(500).json(error);
      }
    });
  },

  deleteUser: async (req, res) => {
    try {
      const userIdToDelete = req.params.id;
      const userDeleting = await User.findById(req.user.userId);
      const user = await User.findById(userIdToDelete);
      if (!user) {
        logger.warn("Tentative de suppression d'un utilisateur inexistant");
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }
      if (user._id.toString() === req.user.userId || userDeleting.isAdmin) {
        const deletedUser = await User.findByIdAndDelete(userIdToDelete);
        logger.info(`Utilisateur ${deletedUser.email} supprimé avec succès`);
        return res.status(200).json({
          message: "l'utilisateur a bien été supprimé",
          data: deletedUser,
        });
      }
      logger.warn(
        "Tentative de suppression d'un utilisateur sans autorisation"
      );
      return res.status(403).json({
        message:
          "vous n'avez pas l'autorisation pour supprimer cet utilisateur",
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression d'un utilisateur");
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  login: async (req, res) => {
    try {
      const userInfo = req.body;
      const { error } = loginValidationSchema.validate(userInfo, {
        allowUnknown: true,
      });
      if (error) {
        logger.warn('Échec de la validation lors de la tentative de connexion');
        return res.status(400).send(error.message);
      }

      const user = await User.findOne({ email: userInfo.email });
      if (!user) {
        logger.warn('Tentative de connexion avec un e-mail non enregistré');
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }
      const checkPassword = await bcrypt.compare(
        userInfo.password,
        user.password
      );
      if (!checkPassword) {
        logger.warn('Tentative de connexion avec un mot de passe incorrect');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      const token = jwt.sign({ userId: user.id }, private_key, {
        expiresIn: '24h',
      });
      logger.info(`Utilisateur ${user.email} connecté avec succès`);
      return res.status(200).json({
        message: `${user.email} est bien connecté`,
        token,
        user,
      });
    } catch (error) {
      console.log(error);
      logger.error("Erreur lors de la connexion d'un utilisateur");
      return res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement.',
        error,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const userIdToUpdate = req.params.id;
      const userAdminId = req.user.userId;
      const newData = req.body;

      const userToUpdate = await User.findById(userIdToUpdate);
      if (!userToUpdate) {
        logger.warn("Tentative de mise à jour d'un utilisateur inexistant");
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }

      const userAdmin = await User.findById(userAdminId);
      console.log(userAdmin.isAdmin);

      if (userAdmin.isAdmin) {
        const updatedUser = await User.findByIdAndUpdate(
          userIdToUpdate,
          newData,
          { new: true }
        );
        res.status(200).json({
          message: "l'utilisateur a bien été mis à jour",
          data: updatedUser,
        });
      }
    } catch (error) {
      console.log(error);
      logger.error("Erreur lors de la connexion d'un utilisateur");
      return res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement.',
        error,
      });
    }
  },
};

module.exports = userController;
