const router = require('express').Router();
const {
    createPost,
    getAllPosts,
    getOnePost,
    updatePost,
    deletePost
} = require('../controllers/post.controller');
const { uploadMultiple } = require('../utils/multer');
const { protect, checkVerification } = require('../middlewares/auth.token');

router.use(protect);
router.use(checkVerification);

router.post('/add', uploadMultiple, createPost);
router.patch('/update/:id',updatePost);

router.get('/get-all',getAllPosts);
router.get('/get/:id',getOnePost);

router.delete('/delete/:id', deletePost)

module.exports = router;