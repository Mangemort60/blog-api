const postController = require('../../controller/postController');
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJwt');

router.post('/', authenticateJWT, postController.createPost);

module.exports = router;
