import { Sequelize } from "sequelize-typescript";
// import dotenv from "dotenv"; 

class Database {    
    public sequelize: Sequelize | undefined;

    constructor(){
        this.connectToDatabase();
    }

    private async  connectToDatabase(){
        this.sequelize = new Sequelize({
            database: process.env["DB_NAME"],
            username: process.env["DB_USER"],
            password: process.env["DB_PASS"],
            host    : process.env["DB_HOST"],

            dialect: 'mysql' 
    });

    await this.sequelize.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the Database:", err);
    });
}
}

export default Database;
//This method is used to synchronize the database state with the models defined in your Sequelize instance. This includes creating tables if they do not exist, and can also include updating existing tables if you have changed your models. It returns a promise that resolves once the synchronization is complete.