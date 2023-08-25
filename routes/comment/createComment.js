const commentController = require('../../controller/commentController');
const express = require('express');
const router = express.Router();

router.post('/', commentController.createComment);

module.exports = router;
