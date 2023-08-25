const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    title: {
      type: String,
      required: true
    }, 
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // author fait référence à la collection User
      required: true
    },
    body: {
      type: String,
      required: true
    },
    img: {
      type: String, // Stocker l'URL de l'image dans S3
      required: true
    },
    comments: [{ 
      body: String,
      author: String,
      headshot: {
        type: String, 
        required: true
      },
      date: Date
    }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs: Number
    }

})

const Post = mongoose.model('Post', postSchema)

module.exports = Post;