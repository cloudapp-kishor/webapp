const { healthCheck } = require('../services/healthService');

const healthCheckStatus = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    const isDatabaseConnected = await healthCheck();
    
    if (isDatabaseConnected) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        return res.status(200).send();
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        return res.status(503).send();
    }
};

module.exports = { healthCheckStatus };
