const {
  Comment,
  postValidationSchema,
  updateValidationSchema,
} = require('../models/commentSchema');
const { Post } = require('../models/postSchema');

const commentController = {
  createComment: async (req, res) => {
    try {
      const postId = req.body.post;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          message: "le poste que vous souhaitez commenter n'existe pas",
        });
      }

      const newComment = req.body;
      const { error } = postValidationSchema.validate(req.body, {
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).send(error.message);
      }

      const createdComment = await Comment.create(newComment);
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
      console.log('erreur detaillée: ', error);
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  updateComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.body.author;
      const newData = req.body;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res
          .status(404)
          .json({ message: "le commentaire n'a pas été trouvé" });
      }

      const { error } = updateValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        return res.status(400).send(error.message);
      }

      if (userId !== comment.author.toString()) {
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
      res.status(200).json({
        message: 'le commentaire a bien été mis à jour',
        data: updatedComment,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.params.author;
      console.log(`comment ID : ${commentId},
      userId : ${userId}`);
      const commentToDelete = await Comment.findOne({ _id: commentId });
      if (!commentToDelete) {
        return res.status(404).json({
          message: "le commentaire n'a pas été trouvé",
        });
      }
      if (userId !== commentToDelete.author.toString()) {
        return res.status(500).json({
          message:
            "vous n'avez pas l'autorisation pour supprimer ce commentaire",
        });
      } else {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(deletedComment.post, {
          $pull: { comment: commentId },
        });
        res.status(200).json({
          message: 'le commentaire a bien été supprimé',
          data: deletedComment,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = commentController;
