const { Sequelize } = require('sequelize');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Falcon = require('../models/falcon.model'); // Add other models as needed
const Identity = require('../models/identity.model');

class Database {
    constructor() {
        this.sequelize = new Sequelize({
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: 'mysql',
            logging: false
        });

        this.initModels();
        this.applyAssociations();
        this.initDB();
    }

    initModels() {
        this.models = {
            User: User.init(this.sequelize, Sequelize),
            Post: Post.init(this.sequelize, Sequelize),
            Falcon: Falcon.init(this.sequelize, Sequelize),
            Identity: Identity.init(this.sequelize, Sequelize)
            // Add other models here
        };
    }

    applyAssociations() {
        Object.keys(this.models).forEach(modelName => {
            if (this.models[modelName].associate) {
                this.models[modelName].associate(this.models);
            }
        });
    }

    initDB() {
        this.sequelize.sync()
            .then(() => { console.log('DB sync....'); })
            .catch((err) => { console.log('Error in sync', err); });
    }
}

const database = new Database();

module.exports = {
    db: database.sequelize,
    models: database.models
};