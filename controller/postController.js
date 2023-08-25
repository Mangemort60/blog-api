const Post = require('../models/postSchema'); // import Post model

const postController = {
  createPost: async (req, res) => {
    try {
      const postData = req.body;
      console.log(postData);
      const newPost = new Post(postData);
      const savedPost = await newPost.save();
      return res.status(201).json({
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
      console.log('updated postId: ', postId);
      const newData = req.body;
      const updatedPost = await Post.findByIdAndUpdate(postId, newData, {
        new: true,
      });
      if (!updatedPost) {
        return res
          .status(404)
          .json({ message: "Le post n'a pas été trouvé !!" });
      }
      res
        .status(201)
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
      const deletedPost = await Post.findOneAndDelete(postId);
      console.log(deletedPost);
      if (!deletedPost) {
        return res.status(404).json({ message: "le post n'a pas été trouvé" });
      }
      res
        .status(201)
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
