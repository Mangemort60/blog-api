const commentController = require('../../controller/commentController');
const postController = require('../../controller/commentController');
const express = require('express');
const router = express.Router({ mergeParams: true });

// ici middleware si besoin //

router.get('/:id', commentController.getCommentByPost);

module.exports = router;
