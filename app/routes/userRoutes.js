const express = require('express');
const { createUserController, getUserController, updateUserController } = require('../controller/userController');
const basicAuthorization = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/v1/user', createUserController);

router.get('/v1/user/self', basicAuthorization, getUserController);
router.put('/v1/user/self', basicAuthorization, updateUserController);

module.exports = router;
