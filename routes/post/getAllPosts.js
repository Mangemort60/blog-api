const postController = require('../../controller/postController');
const express = require('express');
const router = express.Router();

router.get('/', postController.getAllPost);

module.exports = router;
