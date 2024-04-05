const router = require('express').Router();
const {protect} = require('../utils/auth.token');
const {
    initialRegister,
    verifyCode
} = require('../controllers/auth.controller');

router.post('/register/initial/:method', initialRegister);
router.post('/register/verify',protect, verifyCode);

module.exports = router;
