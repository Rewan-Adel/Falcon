const {
    serverErrorMessage,
    badRequestMessage
} = require('../middlewares/error.messages.middleware');
const { 
    uploadImgToCloud 
} = require('../utils/cloudHandler');

const {models} = require('../config/Database');
const {Identity} = models;
const uploadCardImage = async(req, res)=>{
    const {userID} = req.user;
    if(!req.file) return badRequestMessage('Card image is required.',res);

    try{
        const identity = await Identity.findOne({where: {userID}});
        let img = await uploadImgToCloud(req.file.path);
        
        if(identity) {
            identity.cardImageURL = img.url;
            await identity.save();
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Card image uploaded.'
            });
        }

        await Identity.create({userID, cardImageURL: img.url});

        return res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Card image uploaded.'
        });
    }catch(error){
        console.log('Error at upload card image: ', error);
        return serverErrorMessage(error, res);
    }
};

const uploadSelfieImage = async(req, res)=>{
    const {userID} = req.user;

    if(!req.file) return badRequestMessage('Selfie image URL is required.',res);
    
    try{
        const identity = await Identity.findOne({where: {userID}});
        let img = await uploadImgToCloud(req.file.path);

        if(identity) {
            identity.selfieImageURL = img.url;
            await identity.save();
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Selfie image uploaded.'
            });
        };

        identity.selfieImageURL = url;
        await Identity.create({userID, selfieImageURL: img.url});

        return res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Selfie image uploaded.'
        });
    }catch(error){
        console.log('Error at Selfie card image: ', error);
        return serverErrorMessage(error, res);
    }
};


//Admin operations
const approveIdentity = async(req, res)=>{
    try{
        const {userID} = req.params;
        const identity = await Identity.findOne({where: {userID}});
        
        if(!identity) return badRequestMessage('Identity not found!', res);
        if(identity.Verification === 'approved') return badRequestMessage('Identity already approved.', res);
        
        identity.Verification = 'approved';
        await identity.save();

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Identity approved.'
        });
    }catch(error){
            console.log('Error at approve Identity: ', error);
            return serverErrorMessage(error, res);
        }
};
const refuseIdentity = async(req, res)=>{
    try{
        const {userID} = req.params;
        const identity = await Identity.findOne({where: {userID}});
        
        if(!identity) return badRequestMessage('Identity not found!', res);
        if(identity.Verification === 'refused') return badRequestMessage('Identity already refused.', res);
        
        identity.Verification = 'refused';
        await identity.save();

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Identity refused.'
        });
    }catch(error){
            console.log('Error at refuse Identity: ', error);
            return serverErrorMessage(error, res);
        }
};

const reviewIdentity = async(req, res)=>{
    try{
        const {userID} = req.params;
        const identity = await Identity.findOne({where: {userID}});
        
        if(!identity) return badRequestMessage('Identity not found!', res);
        if(identity.Verification === 'review') return badRequestMessage('Identity already review.', res);
        
        identity.Verification = 'review';
        await identity.save();

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Identity needs review.'
        });
    }catch(error){
            console.log('Error at review Identity: ', error);
            return serverErrorMessage(error, res);
        }
};

module.exports = {
    uploadCardImage,
    uploadSelfieImage,
    approveIdentity,
    refuseIdentity,
    reviewIdentity
};