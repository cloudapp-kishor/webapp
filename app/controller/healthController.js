const { healthCheck } = require('../services/healthService');
const {logger} = require('../logger');

const healthCheckStatus = async (req, res) => {
    logger.info('Received health check request');
    res.setHeader('Cache-Control', 'no-cache');
    const isDatabaseConnected = await healthCheck();
    
    if (isDatabaseConnected) {
        logger.info('Database connection is healthy');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        return res.status(200).send();
    } else {
        logger.warn('Database connection is not healthy');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        return res.status(503).send();
    }
};

module.exports = { healthCheckStatus };