const { where } = require("sequelize");
const {models} = require("../config/Database");
const {Follow, User} = models
const {
    badRequestMessage,
    serverErrorMessage
} = require('../middlewares/error.messages.middleware');

const addFollow = async(req, res)=>{
    const {userID} = req.user;
    const {followedID} = req.params;
    if (!userID || !followedID) {
        return badRequestMessage("User ID or followed ID is missing.", res);
    }
    try{

        if(userID == followedID) return badRequestMessage("Invalid", res);

        const followedUser = await User.findByPk(followedID);
        let follow = await Follow.findOne({
            where:{
                followedID,
                followerID : userID
            }
        });
        
        if (!followedUser)  return badRequestMessage("User not found.", res);
        if(follow) return badRequestMessage(`Already following ${followedUser.username}`, res);

        follow = await Follow.create({
            followedID,
            followerID : userID
        });

        //send notification to followedUser
        return res.status(201).json({
            status: "success",
            code: 201,
            message : `following ${followedUser.username}`,
        })


    }catch(error){
        console.log("Error at addFollow function:  ", error)
        return serverErrorMessage(error, res);
    }

};

const unFollow = async(req, res)=>{
    const {userID} = req.user;
    const {followedID} = req.params;
    if (!userID || !followedID) {
        return badRequestMessage("User ID or followed ID is missing.", res);
    }
    try{

        if(userID == followedID) return badRequestMessage("Invalid.", res);

        const followedUser = await User.findByPk(followedID);
        let follow = await Follow.findOne({
            where:{
                followedID,
                followerID : userID
            }
        });
        
        if (!followedUser)  return badRequestMessage("User not found.", res);
        if(!follow) return badRequestMessage(`You not following ${followedUser.username}`, res);

        await Follow.destroy({
            where:{
                followedID,
                followerID : userID
            }
        })

        return res.status(200).json({
            status: "success",
            code: 200,
            message : `Successfully unfollowed ${followedUser.username}`,
        })


    }catch(error){
        console.log("Error at addFollow function:  ", error)
        return serverErrorMessage(error, res);
    }
};

const getFollowers= async(req, res)=>{
    const {userID} = req.params;
    if(!userID) return badRequestMessage('User ID is missing', res);
    try{
        const limit = req.params.limit || 10;
        const page = req.params.page   || 1;
        const skip = (page - 1) * limit;

        const user = await User.findByPk(userID);
        if(!user) return badRequestMessage('User not found!', res);

        const {count, rows} = await Follow.findAndCountAll({
            limit: limit,
            offset: skip,
            order: [['createdAt', 'DESC']],
            include:[
                {model: User, as: 'follower'}
            ],
            where:{
                followedID: userID
            }
        });

        return res.status(200).json({
            status: "success",
            code: 200,
            totalFollowers: count,
            followers: rows
        });
    }catch(error){
        console.log("Error at addFollow function:  ", error)
        return serverErrorMessage(error, res);
    }
}; 

const getFollowing= async(req, res)=>{
    const {userID} = req.params;
    if(!userID) return badRequestMessage('User ID is missing', res);
    try{
        const limit = req.params.limit || 10;
        const page = req.params.page   || 1;
        const skip = (page - 1) * limit;

        const user = await User.findByPk(userID);
        if(!user) return badRequestMessage('User not found!', res);

        const {count, rows} = await Follow.findAndCountAll({
            limit: limit,
            offset: skip,
            order: [['createdAt', 'DESC']],
            include:[
                {model: User, as: 'followed'}
            ],
            where:{
                followerID: userID
            }
        });

        return res.status(200).json({
            status: "success",
            code: 200,
            totalFollowing: count,
            following: rows
        });
    }catch(error){
        console.log("Error at addFollow function:  ", error)
        return serverErrorMessage(error, res);
    }
}; 
module.exports = {
    addFollow,
    unFollow,
    getFollowers,
    getFollowing
};