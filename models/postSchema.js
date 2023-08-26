const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  img: {
    type: String, // Stocker l'URL de l'image dans S3
    required: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // author fait référence à la collection User
    required: true,
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment', // comment fait référence à la collection Comment
    },
  ],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
