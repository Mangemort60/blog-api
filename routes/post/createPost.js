const postController = require('../../controller/postController');
const express = require('express');
const router = express.Router();

// ici middleware si besoin //

router.post('/', postController.createPost);

module.exports = router;
