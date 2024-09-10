const {DataTypes} = require('sequelize');
const db = require('../config/Database');

const Identities = db.define('Identities', {
    identityID :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
    },
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
    timestamps: false
});

module.exports = Identities;