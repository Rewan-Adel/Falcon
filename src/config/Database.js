const { Sequelize } = require('sequelize');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Falcon = require('../models/falcon.model'); 
const Identity = require('../models/identity.model');
const Comment =require('../models/comment.model');
const Likes = require('../models/likes.model');
const Follow = require('../models/follow.model');
const Group = require('../models/group.model');
const GroupMember = require('../models/groupMember.model');
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
            Identity: Identity.init(this.sequelize, Sequelize),
            Comment: Comment.init(this.sequelize, Sequelize),
            Likes: Likes.init(this.sequelize, Sequelize),
            Follow: Follow.init(this.sequelize, Sequelize),
            Group: Group.init(this.sequelize, Sequelize),
            GroupMember : GroupMember.init(this.sequelize, Sequelize)
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