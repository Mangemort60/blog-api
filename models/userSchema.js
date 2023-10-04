const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');

const registerValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum().required(),
  pseudo: Joi.string().min(3).max(15).required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum().required(),
});

const profilValidationSchema = Joi.object({
  bio: Joi.string().max(500),
});

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  pseudo: {
    type: String,
    unique: true,
  },
  bio: {
    type: String,
    required: false,
  },
  headshot: {
    type: String, // Stocker l'URL de l'image dans S3
    required: false,
    default: null,
  },
  isAuthor: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  post: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

const User = mongoose.model('User', userSchema);

userSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique !',
});

module.exports = {
  User,
  registerValidationSchema,
  loginValidationSchema,
  profilValidationSchema,
};
