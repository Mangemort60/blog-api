const userController = require('../../controller/userController');
const express = require('express');
const router = express.Router({ mergeParams: true });

router.delete('/:id', userController.deleteUser);

module.exports = router;
