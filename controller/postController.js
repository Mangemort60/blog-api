const { restart } = require('nodemon');
const Post = require('../models/postSchema') // import Post model

const postController = {

    createPost: async(req, res) => {
        try {
            const postData = req.body;
            console.log(postData);
            const newPost = new Post(postData);
            const message = "Le post a bien été crée"
            const savedPost = await newPost.save();            
            return res.status(201).json({
                message, data: savedPost})
        
        } catch (error) {
            res.status(500).json({message: 'Une erreur est survenue, veuillez essayer ultérieurement', error})
        }
    },

    getAllPost: async (req, res) => {
        try {
            const posts = await Post.find();
            res.json(posts)
        } catch (error) {
            res.status(500).json({message: 'Une erreur est survenue, veuillez essayer ultérieurement', error})
        }
    },

    updatePost: async (req, res) => {
        try {
            const postId = req.params.id
            const newData = req.body
            const updatedPost = await Post.findByIdAndUpdate(postId, newData)
            const message = "Le post a bien été mis à jour"
            res.status(201).json({ message : message, data: updatedPost })
        } catch (error) {
            res.status(500).json({message: 'Une erreur est survenue, veuillez essayer ultérieurement', error})
        }
    }
}

module.exports = postController;