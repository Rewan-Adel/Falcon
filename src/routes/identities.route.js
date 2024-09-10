const router = require('express').Router();
const multer = require('multer');
const {
    uploadCardImage,
    uploadSelfieImage,
    approveIdentity,
    refuseIdentity,
    reviewIdentity
} = require('../controllers/identities.controller.js');

const {uploadSingle} = require("../utils/multer");
const {protect,restrictTo} = require('../middlewares/auth.token'); 

// User routes
router.use(protect);
router.post('/upload-card-image',  uploadSingle, uploadCardImage);
router.post('/upload-selfie-image',uploadSingle, uploadSelfieImage);

// Admin routes
router.use(restrictTo('admin'));
router.patch('/approve/:userID', approveIdentity);
router.patch('/review/:userID', reviewIdentity);
router.patch('/refuse/:userID', refuseIdentity);

module.exports = router;