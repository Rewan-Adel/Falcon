const router = require('express').Router();
const {
    createProduct,
    getAllProducts,
    updateProduct
} = require('../controllers/market.controller');
const {uploadMultiple} = require('../utils/multer');
const {protect,restrictTo} = require('../middlewares/auth.token'); 

router.use(protect);
router.post("/add",uploadMultiple, createProduct);
router.get("/get-all", getAllProducts);
router.patch("/update/:id", updateProduct);

module.exports = router;