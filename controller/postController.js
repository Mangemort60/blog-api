const s3 = require('../config/aws-config');
const {
  Post,
  postValidationSchema,
  updateValidationSchema,
} = require('../models/postSchema'); // import Post model
const { User } = require('../models/userSchema');
const logger = require('../config/logger');
const formidable = require('formidable');
const fs = require('fs');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const postController = {
  createPost: async (req, res) => {
    try {
      const postData = req.body;
      const { error } = postValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        logger.warn(`Échec de la validation à la création: ${error.message}`);
        return res.status(400).send(error.message);
      }
      const createdPost = await Post.create(postData);
      const userToUpdate = await User.findByIdAndUpdate(req.user.userId, {
        $push: { post: createdPost },
      });
      if (!userToUpdate) {
        logger.warn(`User ID ${req.user.userId} introuvable`);
        return res
          .status(404)
          .json({ message: "L'utilisateur n'a pas été trouvé !" });
      }

      logger.info('Le post a bien été créé');

      res.status(201).json({
        message: 'Le post a bien été crée',
        createdPost,
      });
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  uploadImage: async (req, res) => {
    console.log('Début de la fonction uploadImage.');

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      console.log('Formidable a terminé le parsing.');
      console.log('FILES', files);
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
        Bucket: 'youssratherapie',
        Key: `${fileName}-${Date.now()}`,
        Body: fileStream,
        ContentType: fileType,
      };

      try {
        console.log("Tentative d'upload sur S3.");
        const uploadResult = await s3.send(new PutObjectCommand(params));
        console.log('Upload réussi. Résultat: ', uploadResult);
        const imageUrl = `https://${params.Bucket}.s3.eu-west-3.amazonaws.com/${params.Key}`;
        res.send({
          message: 'Upload réussi',
          imageUrl: imageUrl,
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

  getAllPost: async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 }).populate('author');
      logger.info('Récupération de tous les posts réussie');
      res.status(200).json(posts);
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération de tous les posts : ${error}`
      );
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  getPost: async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const post = await Post.findById(postId)
        .populate('author')
        .populate('comment');
      if (!post) {
        logger.warn(`Post ID ${postId} introuvable`);
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !" });
      }

      logger.info(`Récupération du post ID ${postId} réussie`);

      res.status(201).json({ message: 'le post a bien été récupéré', post });
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération du post ID ${postId} : ${error}`
      );
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const newData = req.body;
      const { error } = updateValidationSchema.validate(req.body);
      if (error) {
        logger.warn(
          `Échec de la validation à la mise à jour: ${error.message}`
        );
        return res.status(400).send(error.message);
      }
      const post = await Post.findById(postId);
      if (!post) {
        logger.warn(`Post ID ${postId} introuvable`);
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !!" });
      }
      if (req.user.userId !== post.author.toString()) {
        logger.warn('Tentative de mise à jour non autorisée');
        return res.status(403).json({
          message: "vous n'avez pas l'autorisation de mettre à jour ce post",
          data: post,
        });
      }
      const updatedPost = await Post.findByIdAndUpdate(postId, newData, {
        new: true,
      });

      logger.info(`Post ID ${postId} mis à jour`);

      res
        .status(200)
        .json({ message: 'Le post a bien été mis à jour', data: updatedPost });
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        logger.warn(`Post ID ${postId} introuvable`);
        return res.status(404).json({ message: "le post n'a pas été trouvé" });
      }
      if (req.user.userId !== post.author.toString()) {
        logger.warn(
          `Tentative non autorisée de suppression du post ID ${postId}`
        );
        return res
          .status(404)
          .json({ mesage: "vous n'êtes pas autorisé à supprimer ce post" });
      }

      const startIndex =
        post.img.indexOf('https://blog.mern.s3.eu-west-3.amazonaws.com/') +
        'https://blog.mern.s3.eu-west-3.amazonaws.com/'.length;
      const key = post.img.substring(startIndex);

      const params = {
        Bucket: 'blog.mern',
        Key: key,
      };

      console.log('Image to delete', key);
      const deletedImg = await s3.deleteObject(params);
      const deletedPost = await Post.findByIdAndDelete(postId);
      console.log('Image deleted', deletedImg);

      await User.findByIdAndUpdate(deletedPost.author, {
        $pull: { posts: postId },
      });

      logger.info(`Post ID ${postId} supprimé avec succès`);

      res
        .status(200)
        .json({ message: 'les post a bien été supprimé', data: deletedPost });
    } catch (error) {
      logger.error(
        `Erreur lors de la suppression du post ID ${postId} : ${error}`
      );
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = postController;
