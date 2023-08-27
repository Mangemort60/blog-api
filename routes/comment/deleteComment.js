const commentController = require('../../controller/commentController.js');
const express = require('express');
const router = express.Router({ mergeParams: true });

router.delete('/:id/:author', commentController.deleteComment);

module.exports = router;
