const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host    : process.env.DB_HOST,
    port    : process.env.DB_PORT,
    dialect: 'mysql' 
});

module.exports = sequelize.sync();
//This method is used to synchronize the database state with the models defined in your Sequelize instance. This includes creating tables if they do not exist, and can also include updating existing tables if you have changed your models. It returns a promise that resolves once the synchronization is complete.