const userController = require('../../controller/userController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateJWT = require('../../middleware/authenticateJwt');

router.delete('/:id/:author', authenticateJWT, userController.deleteUser);

module.exports = router;
