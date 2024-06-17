const router = require('express').Router();
const {protect} = require('../utils/auth.token');
const {
    register,
    verifyCode,
    completeProfile,
    createUsername,resendCode,

    login, loginPass
} = require('../controllers/auth.controller');

router.post('/register/:way', register);

router.use(protect);

router.post('/verify/code', verifyCode);
router.get( '/verify/resend', resendCode);

router.post('/register/complete/profile', completeProfile);
router.post('/register/complete/profile/username', createUsername);

router.post('/login/:way', login);
router.post('/login/enter/password', loginPass);

module.exports = router;
