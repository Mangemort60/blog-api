const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  headshot: {
    type: String,
    required: false,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  date: Date,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
