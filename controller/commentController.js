const {
  Comment,
  postValidationSchema,
  updateValidationSchema,
} = require('../models/commentSchema');
const { Post } = require('../models/postSchema');
const logger = require('../config/logger');

const commentController = {
  createComment: async (req, res) => {
    try {
      const postId = req.body.post;
      const post = await Post.findById(postId);

      if (!post) {
        logger.warn('Tentative de commentaire sur un poste inconnu');
        return res.status(404).json({
          message: "le poste que vous souhaitez commenter n'existe pas",
        });
      }
      const newComment = { ...req.body, author: req.user.userId };
      const { error } = postValidationSchema.validate(req.body);

      if (error) {
        logger.warn(`Échec de validation: ${error.message}`);
        console.log(error);
        return res.status(400).send(error.message);
      }

      const createdComment = await Comment.create(newComment);

      logger.info('Nouveau commentaire créé');

      const updatedPost = await Post.findByIdAndUpdate(postId, {
        $push: { comment: createdComment },
      });

      if (updatedPost) {
        return res.status(201).json({
          message: 'le commentaire a bien été crée',
          data: createdComment,
        });
      }
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  updateComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const newData = req.body;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        logger.warn(`Commentaire ID ${commentId} introuvable`);
        return res
          .status(404)
          .json({ message: "le commentaire n'a pas été trouvé" });
      }
      const { error } = updateValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        logger.warn(
          `Échec de la validation à la mise à jour: ${error.message}`
        );
        return res.status(400).send(error.message);
      }
      if (req.user.userId !== comment.author.toString()) {
        logger.warn('Tentative de mise à jour non autorisée');
        return res.status(403).json({
          message: "vous n'êtes pas autorisé à mettre à jour ce commentaire",
        });
      }
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        newData,
        {
          new: true,
        }
      );

      logger.info(`Commentaire ID ${commentId} mis à jour`);

      res.status(200).json({
        message: 'le commentaire a bien été mis à jour',
        data: updatedComment,
      });
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const commentToDelete = await Comment.findOne({ _id: commentId });
      if (!commentToDelete) {
        logger.warn(`Commentaire ID ${commentId} introuvable`);
        return res.status(404).json({
          message: "le commentaire n'a pas été trouvé",
        });
      }
      if (req.user.userId !== commentToDelete.author.toString()) {
        logger.warn('Tentative de suppression non autorisée');
        return res.status(500).json({
          message:
            "vous n'avez pas l'autorisation pour supprimer ce commentaire",
        });
      } else {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(deletedComment.post, {
          $pull: { comment: commentId },
        });

        logger.info(`Commentaire ID ${commentId} supprimé`);

        res.status(200).json({
          message: 'le commentaire a bien été supprimé',
          data: deletedComment,
        });
      }
    } catch (error) {
      logger.error(`Erreur interne du serveur: ${error}`);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = commentController;
