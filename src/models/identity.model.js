const {DataTypes} = require('sequelize');
const db = require('../config/Database');

const Identity = db.define('Identity', {
    identityID :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
    },//FOREIGN KEY
    cardImageURL:{
        type: DataTypes.STRING,
    }, 
    selfieImageURL:{
        type: DataTypes.STRING,
    } ,
    Verification:{
        type: DataTypes.ENUM('approved', 'refused', 'pending', 'review'),
        defaultValue: 'pending'
    }
},{
    tableName : 'Identity',
    timestamps: false
});

module.exports = Identity;