const postController = require('../controller/postController')

app.get('/posts', postController.getAllPost)