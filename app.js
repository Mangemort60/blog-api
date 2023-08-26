const mongoose = require('mongoose');
const express = require('express');
const createPost = require('./routes/post/createPost');
const getAllPost = require('./routes/post/getAllPosts');
const updatePost = require('./routes/post/updatePost');
const deletePost = require('./routes/post/deletePost');
const getPost = require('./routes/post/getPost');
const createComment = require('./routes/comment/createComment');
const updateComment = require('./routes/comment/updateComment');
const register = require('./routes/user/register');
const deleteUser = require('./routes/user/deleteUser');
const port = 3000;

// instance d'express
const app = express();

// middleware
app.use(express.json());

//requête get pour hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// connexion
mongoose
  .connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
    // Lancer le serveur Express
    app.listen(port, () => {
      console.log(`listening on port http://localhost:${port}/`);
    });
  })
  .catch((error) => console.log(error));

// Post routes
app.use('/api/post/get', getPost);
app.use('/api/post/update', updatePost);
app.use('/api/post/delete', deletePost);
app.use('/api/post', createPost);
app.use('/api/posts', getAllPost);
// Comment routes
app.use('/api/comment', createComment);
app.use('/api/comment/update', updateComment);
// User routes
app.use('/api/user', register);
app.use('/api/user/delete', deleteUser);
