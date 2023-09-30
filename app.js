require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const createPost = require('./routes/post/createPost');
const getAllPost = require('./routes/post/getAllPosts');
const updatePost = require('./routes/post/updatePost');
const uploadImage = require('./routes/post/uploadImage');
const deletePost = require('./routes/post/deletePost');
const getPost = require('./routes/post/getPost');
const createComment = require('./routes/comment/createComment');
const updateComment = require('./routes/comment/updateComment');
const getCommentByPost = require('./routes/comment/getCommentByPost');
const register = require('./routes/user/register');
const deleteUser = require('./routes/user/deleteUser');
const updateUser = require('./routes/user/updateUser');
const getUser = require('./routes/user/getUser');
const getAllUsers = require('./routes/user/getAllUsers');
const uploadHeadshot = require('./routes/user/uploadHeadshot');
const deleteComment = require('./routes/comment/deleteComment');
const login = require('./routes/user/login');
const cors = require('cors');
const google = require('googleapis');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');

dotenv.config();

// instance d'express
const app = express();

// middleware
app.use(express.json());
app.use(cors());

//requête get pour hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const isDev = () => process.env.NODE_ENV === 'development';

async function connectDb(url) {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to database');
}

const startServer = (port) =>
  app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}/`);
  });

async function main() {
  if (isDev()) {
    await connectDb('mongodb://127.0.0.1:27017/blog');
    return startServer(process.env.PORT ?? 3000);
  }
  console.log('production env');
}

main().catch((error) => console.error(error));

// google api
const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
});

app.get('/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
  res.redirect(url);
});

app.get('/google/redirect', (req, res) => {
  console.log("it's working !");
});

// Post routes
app.use('/api/post/get', getPost);
app.use('/api/post/update', updatePost);
app.use('/api/post/delete', deletePost);
app.use('/api/post', createPost);
app.use('/api/posts', getAllPost);
app.use('/api/post/upload', uploadImage);
// Comment routes
app.use('/api/comment', createComment);
app.use('/api/comment/update', updateComment);
app.use('/api/comment/delete', deleteComment);
app.use('/api/comment/post', getCommentByPost);
// User routes
app.use('/api/user', register);
app.use('/api/user/delete', deleteUser);
app.use('/api/user/login', login);
app.use('/api/user/update', updateUser);
app.use('/api/user/upload', uploadHeadshot);
app.use('/api/user', getUser);
app.use('/api/users', getAllUsers);
