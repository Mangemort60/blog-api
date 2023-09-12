const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

const postValidationSchema = Joi.object({
  body: Joi.string().min(3).max(10000).required(),
  post: Joi.string().required(),
});

const updateValidationSchema = Joi.object({
  body: Joi.string().min(3).max(10000),
});

const commentSchema = new Schema({
  body: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, postValidationSchema, updateValidationSchema };
