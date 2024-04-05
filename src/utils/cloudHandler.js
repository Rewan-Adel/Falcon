const cloudinary = require('../config/cloudinay');
const {serverErrorMessage} = require('../middlewares/error.messages.middleware');

const uploadImgToCloud = async function(filePath){
    try{
        const image = await cloudinary.uploader.upload(filePath);

        return {
            url       : image.secure_url,
            public_id : image.public_id
        }
    }catch(error){
        console.error("Error in cloudHandler file: ",error);
        serverErrorMessage(error);
    }
};

const deleteImgFromCloud = async function(publicId){
    try{
        const image = await cloudinary.uploader.destroy(publicId);
        
        return {};
    }catch(error){
        console.error("Error in cloudHandler file: ",error);
        serverErrorMessage(error);
    }
};

module.exports = {
    uploadImgToCloud,
    deleteImgFromCloud
} 