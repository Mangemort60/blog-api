const postController = require('../../controller/postController')
const express = require('express')
const router = express.Router({mergeParams: true})


// ici middleware si besoin // 

router.post('/:id', postController.updatePost);

module.exports = router