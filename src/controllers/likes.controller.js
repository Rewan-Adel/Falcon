const {models} = require("../config/Database");
const { badRequestMessage, serverErrorMessage } = require("../middlewares/error.messages.middleware");
const {Likes,Comment, Post, User} = models;

// Likes handling of  post
const likePost = async (req, res) => {
    const {userID} = req.user;
    const {postID} = req.params;
    try {

        let post = await Post.findByPk(postID);
        if(!post) return badRequestMessage('Post not found!', res);

        let like = await Likes.findOne({
            where:{
                userID,
                postID
            }
        });
        if(like) return badRequestMessage('You have already liked this post', res); 
        
        like = await Likes.create({
            userID,
            postID
        });
        return res.status(201).json({
            status: 'success',
            code: 201,
            message: `Post Liked.`,
            like
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};

const unlikePost = async (req, res) => {
    const {userID} = req.user;
    const { postID} = req.params;
    try {
        let post = await Post.findByPk(postID);
        if(!post) return badRequestMessage('Post not found!', res);
        
        let like = await Likes.findOne({
            where:{
                userID,
                postID
            }
        });
        if(!like) return badRequestMessage('You have already unliked this post', res); 
        
        if(post.userID != userID) return badRequestMessage('You are not allowed to unlike', res); // check if the user is the owner of the post

        await Likes.destroy({
            where: {
                userID,
                postID
            }
        });
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `Post Unliked.`
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};

const getPostLikes = async (req, res) => {
    try {
        const {postID} = req.params;
        let post = await Post.findByPk(postID);
        if(!post) return badRequestMessage('Post not found!', res);

        const {count , rows} = await Likes.findAndCountAll({
            where:{
                postID
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Post,
                    as: 'post',
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ]
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            code: 200,
            totalLikes: count,
            likes: rows
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};

// Likes handling of  comment
const likeComment = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try {

        let comment = await Comment.findByPk(commentID);
        if(!comment) return badRequestMessage('Comment not found!', res);

        let like = await Likes.findOne({
            where:{
                userID,
                commentID
            }
        });
        if(like) return badRequestMessage('You have already liked this comment', res); 
        
        like = await Likes.create({
            userID,
            commentID
        });
        res.status(201).json({
            status: 'success',
            code: 201,
            message: `comment Liked.`,
            comment
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};
const unlikeComment = async (req, res) => {
    const {userID} = req.user;
    const { commentID} = req.params;
    try {
        let comment = await Comment.findByPk(commentID);
        if(!comment) return badRequestMessage('Comment not found!', res);
        
        let like = await Likes.findOne({
            where:{
                userID,
                commentID
            }
        });
        if(!like) return badRequestMessage('You have already unliked this comment', res); 
        
        if(comment.userID != userID) return badRequestMessage('You are not allowed to unlike', res);

        await Likes.destroy({
            where: {
                userID,
                commentID
            }
        });
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Comment Unliked.`
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};
const getCommentLikes = async (req, res) => {
    try {
        const {commentID} = req.params;
        let comment = await Comment.findByPk(commentID);
        if(!comment) return badRequestMessage('Comment not found!', res);
        
        const {count , rows} = await Comment.findAndCountAll({
            where:{
                commentID
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Comment,
                    as: 'parentComment', // Specify the alias for the parent comment association
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ]
                },
                {
                    model: Comment,
                    as: 'replies', // Specify the alias for the replies association
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ]
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            code: 200,
            totalLikes: count,
            likes: rows
        });
    } catch (error) {
        console.log(error.message)
        return serverErrorMessage(error, res);
    }
};

module.exports = {
    likePost,
    unlikePost,
    getPostLikes,
    likeComment,
    unlikeComment,
    getCommentLikes
};