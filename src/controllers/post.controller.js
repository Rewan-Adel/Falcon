const { where } = require('sequelize');
const { models } = require('../config/Database');

const { Post, User } = models;
const {
    badRequestMessage,
    serverErrorMessage
} = require('../middlewares/error.messages.middleware');
const { 
    uploadImgToCloud 
} = require('../utils/cloudHandler');

// const User = require('../models/user.model');
// const comment = require('../models/comment.model');
// const likes = require('../models/like.model');

const createPost = async(req, res) => {
    const {userID} = req.user;
    // Validate request
    if (!req.body.content && (!req.files || req.files.length===0)) return badRequestMessage("Post content can not be empty", res);
    
    try{
        let value = {...req.body, userID:userID };
        const post = await Post.create(value);
        if(!post) return serverErrorMessage({message:"Can't create new post."}, res);
        
        if (req.files) {
            let imagesArray = [];
            for (let i = 0; i < req.files.length; i++) {
                const { url, public_id } = await uploadImgToCloud(req.files[i].path);
                imagesArray.push({
                    mediaURL: url,
                    mediaPublicId: public_id
                });
            }
            post.images = imagesArray;
            await post.save();
        }

        return  res.status(200).json({
            status: 'success',
            code: 200,
            message: `Post is added successfully.`,
            post
        })
    }catch(err){
        console.log("Error at Add Post function:  ", err)
        return serverErrorMessage(err, res);
    }
};


const updatePost = async(req, res) => {
    const {userID} = req.user;
    const {id} = req.params;  
    try{
        const post = await Post.findByPk(id);
        if(!post) return serverErrorMessage({message:"Post not found!"}, res);
        
        if(post.userID !== userID) return badRequestMessage("You are not allowed to update this post.", res);
        
        await Post.update(req.body, {
            where   : {postID: id},
        })
        if (req.files) {
            let imagesArray = [];
            for (let i = 0; i < req.files.length; i++) {
                const { url, public_id } = await uploadImgToCloud(req.files[i].path);
                imagesArray.push({
                    mediaURL: url,
                    mediaPublicId: public_id
                });
            }
            post.images = imagesArray;
            await post.save();
        }

        return  res.status(200).json({
            status: 'success',
            code: 200,
            message: `Post is updated successfully.`,
        })
    }catch(err){
        console.log("Error at Add Post function:  ", err)
        return serverErrorMessage(err, res);
    }
};


const getAllPosts = async(req, res)=>{
    const limit = req.params.limit || 10;
    const page  = req.params.page  || 1;
    // const skip  = (limit * page) - 1;
    try{
        const {count, rows} = await Post.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
            include: [
                {model: User, as: 'user'}
            ]
        });
        return  res.status(200).json({
            status: 'success',
            code: 200,
            totalPosts:count,
            totalPages: Math.ceil(count/limit),
            currentPage: page,
            posts: rows
        })
    }catch(err){
        console.log("Error at get all posts function:  ", err)
        return serverErrorMessage(err, res);
    }
}

const getOnePost = async(req, res)=>{
    try{
        const post = await Post.findByPk(req.params.id,
            {
                include: [
                    {model: User, as: 'user'}
                ]
            }
        );
        if(!post) return badRequestMessage("Post not founded!", res);

        return res.status(200).json({
            status: 'success',
            code: 200,
            post
        });

    }catch(error){
        console.log("Error at get one post function:  ", err)
        return serverErrorMessage(err, res);
    }
}

const deletePost = async(req, res)=>{
    try{
        const {userID} = req.user;
        const post = await Post.findByPk(req.params.id);
        if(!post) return badRequestMessage("post not founded!", res);
        if(post.userID != userID) return badRequestMessage("You are not allowed  to delete this post.",res);

        await Post.destroy({
            where: { postID: req.params.id }
        });

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: "post is deleted successfully."
        });
    }
    catch(err){
        console.log("Error at Delete post function:  ", err)
        return serverErrorMessage(err, res);
    }
};


const getUserPosts = async(req, res) => {
    const {userID} = req.user;
    const limit = req.params.limit || 10;
    const page  = req.params.page  || 1;
    try{
        const {count, rows} = await Post.findAndCountAll({
            where: {userID},
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
            include: [
                {model: User, as: 'user'}
            ]
        });
        return  res.status(200).json({
            status: 'success',
            code: 200,
            totalPosts:count,
            totalPages: Math.ceil(count/limit),
            currentPage: page,
            posts: rows
        })
    }catch(err){
        console.log("Error at get all posts function:  ", err)
        return serverErrorMessage(err, res);
    }
}
module.exports = {
    createPost,
    getAllPosts,
    getOnePost,
    updatePost,
    deletePost
};