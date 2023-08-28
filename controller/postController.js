const {
  Post,
  postValidationSchema,
  updateValidationSchema,
} = require('../models/postSchema'); // import Post model
const User = require('../models/userSchema');

const postController = {
  createPost: async (req, res) => {
    try {
      const postData = req.body;
      const authorId = req.body.author;
      const newPost = new Post(postData);
      const { error } = postValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).send(error.message);
      }
      const savedPost = await newPost.save();
      await User.findByIdAndUpdate(authorId, {
        $push: { post: savedPost },
      });
      res.status(201).json({
        message: 'Le post a bien été crée',
        data: savedPost,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
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
        console.log('post id : ', postId);
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !" });
      }
      res
        .status(201)
        .json({ message: 'le post a bien été récupéré', data: post });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.body.author;
      const newData = req.body;
      const { error } = updateValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        return res.status(400).send(error.message);
      }
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !!" });
      }
      if (userId !== post.author.toString()) {
        return res.status(403).json({
          message: "vous n'avez pas l'autorisation de mettre à jour ce post",
          data: post,
        });
      }
      const updatedPost = await Post.findByIdAndUpdate(postId, newData, {
        new: true,
      });
      res
        .status(200)
        .json({ message: 'Le post a bien été mis à jour', data: updatedPost });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.params.author;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "le post n'a pas été trouvé" });
      }
      if (userId !== post.author.toString()) {
        return res
          .status(404)
          .json({ mesage: "vous n'êtes pas autorisé à supprimer ce post" });
      }
      const deletedPost = await Post.findByIdAndDelete(postId);
      await User.findByIdAndUpdate(deletedPost.author, {
        $pull: { posts: postId },
      });
      res
        .status(200)
        .json({ message: 'les post a bien été supprimé', data: deletedPost });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = postController;
