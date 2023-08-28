const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

const postValidationSchema = Joi.object({
  body: Joi.string().min(100).max(10000).required(),
});

const updateValidationSchema = Joi.object({
  body: Joi.string().min(100).max(10000),
});

const commentSchema = new Schema({
  body: { type: String, required: true },
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
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, postValidationSchema, updateValidationSchema };
