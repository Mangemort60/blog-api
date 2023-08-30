const postController = require('../../controller/postController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

router.delete('/:id/:author', authenticateJWT, postController.deletePost);

module.exports = router;
