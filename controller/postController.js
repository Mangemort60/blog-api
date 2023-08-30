const {
  Post,
  postValidationSchema,
  updateValidationSchema,
} = require('../models/postSchema'); // import Post model
const { User } = require('../models/userSchema');
const logger = require('../config/logger');

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
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { post: createdPost },
      });

      logger.info('Le post a bien été créé');

      res.status(201).json({
        message: 'Le post a bien été crée',
        data: createdPost,
      });
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const posts = await Post.find();
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
      const post = await Post.findById(postId);
      if (!post) {
        logger.warn(`Post ID ${postId} introuvable`);
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !" });
      }

      logger.info(`Récupération du post ID ${postId} réussie`);

      res
        .status(201)
        .json({ message: 'le post a bien été récupéré', data: post });
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
      const deletedPost = await Post.findByIdAndDelete(postId);
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
