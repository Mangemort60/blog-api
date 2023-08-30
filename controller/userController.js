const { MongooseError } = require('mongoose');
const {
  User,
  registerValidationSchema,
  loginValidationSchema,
} = require('../models/userSchema');
const bcrypt = require('bcrypt');
const private_Key = require('../middleware/private_key');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const userController = {
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
      const token = jwt.sign({ userId: user.id }, private_Key, {
        expiresIn: '24h',
      });
      logger.info(`Utilisateur ${user.email} connecté avec succès`);
      return res
        .status(200)
        .json({ message: `${user.email} est bien connecté`, token });
    } catch (error) {
      logger.error("Erreur lors de la connexion d'un utilisateur");
      return res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement.',
        error,
      });
    }
  },
};

module.exports = userController;
