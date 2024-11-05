// post.model.js
const { DataTypes, Model } = require('sequelize');

class Post extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            postID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'userID'
                },
                allowNull: false
            },
            content: {
                type: DataTypes.STRING
            },
            images: {
                type: DataTypes.JSON,
                defaultValue: []
            },
            privacy: {
                type: DataTypes.STRING,
                defaultValue: 'public'
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        }, {
            sequelize,
            tableName: 'Post',
            timestamps: false
        });
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'userID',
            as: 'user'
        });
        this.hasMany(models.Comment, {
            foreignKey: 'commentID',
            as: 'comments'
        });
        // other associations...
    }
}

module.exports = Post;