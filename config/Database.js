const {Sequelize} = require('sequelize');
require('dotenv').config();
class Database{
    sequelize;

    constructor(){
        this.connectToDatabase()
    }
    async connectToDatabase(){
        this.sequelize = new Sequelize({
            database : process.env.DB_NAME,
            host     : process.env.DB_HOST,
            username : process.env.DB_USER,
            password : process.env.DB_PASSWORD, 

            dialect: 'mysql'
        });

        await this.sequelize.authenticate().then(()=>{
            console.log('Connection has been established successfully.');
        }).catch((err)=>{
            console.log('Unable to connect to db.');
            console.error(err);
        })
    }
};

module.exports = Database;