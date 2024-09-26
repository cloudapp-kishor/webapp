const express = require('express');
const { healthCheckStatus } = require('../controller/healthController');

const router = express.Router();

router.get('/', healthCheckStatus);

module.exports = router;
