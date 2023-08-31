const userController = require('../../controller/userController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

router.put('/:id', authenticateJWT, userController.updateUser);

module.exports = router;
