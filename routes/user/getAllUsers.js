const userController = require('../../controller/userController');
const express = require('express');
const router = express.Router({ mergeParams: true });

// ici middleware si besoin //

router.get('/', userController.getAllUsers);

module.exports = router;
