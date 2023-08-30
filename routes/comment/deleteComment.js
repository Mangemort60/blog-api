const commentController = require('../../controller/commentController.js');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

router.delete('/:id', authenticateJWT, commentController.deleteComment);

module.exports = router;
