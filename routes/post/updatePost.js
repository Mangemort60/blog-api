const postController = require('../../controller/postController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

// ici middleware si besoin //

router.put('/:id', authenticateJWT, postController.updatePost);

module.exports = router;
