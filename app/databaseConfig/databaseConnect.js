require('dotenv').config();
const { Sequelize } = require('sequelize');


//console.log("DB_NAME:", process.env.DB_NAME);
//console.log("DB_USER:", process.env.DB_USER);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

const checkDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database successfully');
        return true;
    } catch (error) {
        console.error('Connection to database failed:', error);
        return false;
    }
};

module.exports = { sequelize, checkDbConnection };
