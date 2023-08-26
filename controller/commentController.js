const Comment = require('../models/commentSchema');

const commentController = {
  createComment: async (req, res) => {
    try {
      const commentDate = new Date();
      const newComment = { date: commentDate, ...req.body };
      const createdComment = await Comment.create(newComment);
      res.status(201).json({
        message: 'le commentaire a bien été crée',
        data: createdComment,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  updateComment: async (req, res) => {
    try {
      const userId = req.params.userid;
      const commentId = req.params.commentid;
      const comment = await Comment.findById(commentId);
      const newData = req.body;

      if (userId === comment.author.toString()) {
        const updatedPost = await Comment.findByIdAndUpdate(
          commentId,
          newData,
          {
            new: true,
          }
        );
      }
    } catch (error) {}
  },
};

module.exports = commentController;
