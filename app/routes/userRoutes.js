const express = require('express');
const { createUserController, getUserController, updateUserController } = require('../controller/userController');
const basicAuthorization = require('../middleware/authMiddleware');

const router = express.Router();

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
};

router.head('/user/self', (req,res) => {res.status(405).header(headers).send();});
router.head('/user', (req,res) => {res.status(405).header(headers).send();});
router.options('/user', (req,res) => {res.status(405).header(headers).send();});
router.options('/user/self', (req,res) => {res.status(405).header(headers).send();});

router.post('/user', createUserController);

router.get('/user/self', basicAuthorization, getUserController);
router.put('/user/self', basicAuthorization, updateUserController);

router.all('/user', (req,res) => {res.status(405).header(headers).send();});
router.all('/user/self', (req,res) => {res.status(405).header(headers).send();});

module.exports = router;
