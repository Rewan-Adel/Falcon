const {Sequelize} = require('sequelize');
require('dotenv').config();

class Database{
    constructor(){
        this.connectToDatabase();
        this.initDB();
    }

    connectToDatabase(){
        this.sequelize = new Sequelize({
            database : process.env.DB_NAME,
            host     : process.env.DB_HOST,
            username : process.env.DB_USER,
            password : process.env.DB_PASSWORD, 

            dialect: 'mysql',
            logging: false
        });
    }

    initDB(){
        this.sequelize.sync()
            .then(()=>{ console.log('DB sync....');})
            .catch((err)=>{console.log('Error in sync',err);} ); 
    }
};

module.exports = new Database().sequelize;