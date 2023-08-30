const commentController = require('../../controller/commentController');
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJwt');

router.post('/', authenticateJWT, commentController.createComment);

module.exports = router;
