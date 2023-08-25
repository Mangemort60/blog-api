const Comment = require('../models/commentSchema');

const commentController = {
  createComment: async (req, res) => {
    try {
      const commentDate = new Date();
      const newComment = { date: commentDate, ...req.body };
      const createdComment = await Comment.create(newComment);
      res.status(201).json({
        message: 'le commentaire a bien été créer',
        data: createdComment,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = commentController;
