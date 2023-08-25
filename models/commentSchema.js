const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  body: String,
  author: String,
  headshot: {
    type: String,
    required: false,
  },
  date: Date,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
