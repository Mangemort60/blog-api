const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
  email: String,
  password: String,
  pseudo: String,
  isAuthor: Boolean,
  isAdmin: Boolean,
  post: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
