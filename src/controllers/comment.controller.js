const {models} = require('../config/Database');
const {Comment, Post, User} = models;
const {
    serverErrorMessage,
    badRequestMessage
} = require('../middlewares/error.messages.middleware');

//Post Comments Handling
const createPostComment = async (req, res) => {
    const {userID} = req.user;
    const {postID} = req.params;
    try{
        const post = await Post.findByPk(postID);
        if(!post) return badRequestMessage("Post not found!", res);

        if(req.body.parentCommentID ){
            const parentComment = await Comment.findByPk(req.body.parentCommentID);
            if(!parentComment) return badRequestMessage("Parent comment not found!", res);
        }
        let value = {...req.body, postID, userID};

        const comment = await Comment.create(value,
        //     {
        //         include:[
        //         {models: User, as: 'user'},
        //         {models: Post, as: 'post'}
        //     ]
        // }
        );
        if(!comment) return serverErrorMessage({message:"Can't create comment"}, res);

        return res.status(201).json({
            status: 'success',
            code: 201,
            message: `Comment is added successfully.`,
            comment
        })
    }catch(error){
        console.log("Error in createPostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const updatePostComment = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Post.findByPk(commentID);
        if(!comment) return badRequestMessage("Comment not found!", res);
        
        if(comment.userID !== userID) return badRequestMessage("You are not allowed to update this comment.", res);
        if(!req.body) return badRequestMessage("Please, enter your update");

        await Comment.update(req.body, {
            where:{ commentID}
        })

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Comment is updated successfully.`
        })
    }catch(error){
        console.log("Error in updatePostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const getPostComment  = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Comment.findByPk(commentID,
            {
                include:[
                    {
                        model: Comment, as: 'replies',
                        include:{model: User, as: 'user'}
                    },
                    {model: User, as: 'user'},
                    {model: Post, as: 'post'}
            ]
        }
        );
        if(!comment) return badRequestMessage("Comment not found!", res);
        

        return res.status(200).json({
            status: 'success',
            code: 200,
            comment
        })
    }catch(error){
        console.log("Error in getPostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const getAllPostComments  = async (req, res) => {
    const {postID} = req.params;
    try{
        const post = await Post.findByPk(postID);
        if(!post) return badRequestMessage("Post not found!", res);

        const {count, rows} = await Comment.findAndCountAll({
            where:{
                postID
            },
            include:[
                {
                    model: Comment, as: 'replies',
                    include:{model: User, as: 'user'}
                },
                {model: User, as: 'user'},
                {model: Post, as: 'post'}
            ]
        });        

        return res.status(200).json({
            status: 'success',
            code: 200,
            totalComments: count,
            comments: rows
        })
    }catch(error){
        console.log("Error in getAllPostComments function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const deletePostCommentAndReplies   = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Comment.findByPk(commentID);
        if(!comment) return badRequestMessage("Comment not found!", res);
        
        if(comment.userID !== userID) return badRequestMessage("You are not allowed to delete this comment.", res);

        await Comment.destroy({
            where:{ commentID}
        })
        await Comment.destroy({
            where: { parentCommentID: commentID },
        });
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Comments is deleted successfully.`
        })
    }catch(error){
        console.log("Error in deletePostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

module.exports = {
    createPostComment,
    updatePostComment,
    getPostComment,
    getAllPostComments,
    deletePostCommentAndReplies
};