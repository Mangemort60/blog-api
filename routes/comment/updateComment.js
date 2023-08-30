const commentController = require('../../controller/commentController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

router.put('/:id', authenticateJWT, commentController.updateComment);

module.exports = router;
