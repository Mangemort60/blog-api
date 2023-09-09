const userController = require('../../controller/userController');
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../middleware/authenticateJwt');

router.post('/:id', userController.uploadHeadshot);

module.exports = router;
