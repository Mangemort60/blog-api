const postController = require('../../controller/postController')
const express = require('express')
const router = express.Router()


// ici middleware si besoin // 

router.delete('/', postController.deletePost);

module.exports = router