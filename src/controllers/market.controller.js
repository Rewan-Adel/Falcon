const Falcon = require("../models/Falcon.model");
const {
    badRequestMessage,
    serverErrorMessage
} = require('../middlewares/error.messages.middleware');

const {
    FalconValidation,
    updateFalconValidation
} = require('../validation/Falcon.validation');

const { 
    uploadImgToCloud 
} = require('../utils/cloudHandler');



const createProduct = async (req, res)=>{
    try{
        const {userID} = req.user;
        let {value, error} = FalconValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        if(!req.files || req.files.length === 0)  return badRequestMessage("Please, upload the product's images.", res);
        
        value = {...value, ownerID: userID,  images: []};
        const product = await Falcon.create(value);
        
        if(!product) return serverErrorMessage({message:"Can't create new falcon."}, res);

    
        for(let i=0; i< req.files.length; i++){
            const {url, public_id} = await uploadImgToCloud(req.files[i].path);

            product.images.push({
            mediaURL: url,
            mediaPublicId: public_id
        });
    }
    console.log("before save: ", product.images)
    await product.save();
    console.log("after save: ", product.images)
        return  res.status(200).json({
            status: 'success',
            code: 200,
            message: `${product.name} is added successfully.`,
            product
        })
    }
    catch(err){
        console.log("Error at Add Falcon function:  ", err)
        return serverErrorMessage(err, res);
    }
};


const getAllProducts = async(req, res)=>{
    const limit = req.params.limit || 10;
    const page  = req.params.page  || 1;
    // const skip  = (limit * page) - 1;
    const skip = (page - 1) * limit;

    const {count, rows} = await Falcon.findAndCountAll({
        limit: limit,
        offset: skip,
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
        status: 'success',
        code: 200,
        totalProducts: count,
        totalPages: Math.ceil(count/limit),
        currentPage: page,
        products: rows,
    });
}

const updateProduct = async (req, res)=>{
    try{
        const {userID} = req.user;
        const {value, error} = updateFalconValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let product = await Falcon.findByPk(req.params.id);
        if(!product) return badRequestMessage("Product not founded!", res);
        if(product.ownerID != userID) return badRequestMessage("you don't have the right to update this product.",res);
        
        product = await Falcon.update(value, {
            where:{ FalconID : req.params.id }
        });
        
        
        if (req.files && req.files.length !== 0) {
            for(let i=0; i< req.files.length; i++){
                const {url, public_id} = await uploadImgToCloud(req.files[i].path);
                product.images.push({
                    mediaURL: url,
                    mediaPublicId: public_id
                });
            }

            await product.save();
        }
        return  res.status(200).json({
            status: 'success',
            code: 200,
            message: "Product is updated successfully.",
        })
    }
    catch(err){
        console.log("Error at AddFalcon function:  ", err)
        return serverErrorMessage(err, res);
    }
};

const getOneProduct = async (req, res)=>{
    try{
        const product = await Falcon.findByPk(req.params.id);
        if(!product) return badRequestMessage("Product not founded!", res);

        return res.status(200).json({
            status: 'success',
            code: 200,
            product
        });

    }
    catch(err){
        console.log("Error at getOneProduct function:  ", err)
        return serverErrorMessage(err, res);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    getOneProduct
}
