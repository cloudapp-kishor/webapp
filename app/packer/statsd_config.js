require('dotenv').config({ path: '../../.env' });

module.exports = {
    port: 8125,
    backends: ["statsd-cloudwatch-backend"],
    cloudwatch: {
        namespace: "MyApp",
        region: "process.env.REGION"
    }
};
