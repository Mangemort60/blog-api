const commentController = require('../../controller/commentController');
const express = require('express');
const router = express.Router({ mergeParams: true });

router.put('/:id', commentController.updateComment);

module.exports = router;
