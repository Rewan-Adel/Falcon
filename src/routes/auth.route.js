const router = require('express').Router();
const {protect} = require('../utils/auth.token');
const {
    register,
    verifyCode,
    completeProfile,
    createUsername,
    resendCode,
    login,
    loginPass,
    getGoogleAuthURL,
    googleRegisterAPI,
    logout, resetPassword,  forgotPassword
} = require('../controllers/auth.controller');

router.post('/register/:way', register);

router.get('/google', (req, res) => {
    res.redirect(getGoogleAuthURL());
});
router.get('/google/callback', googleRegisterAPI );

router.post('/login/:way', login);
router.post('/login/google', login);
router.post('/login/enter/password', loginPass);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.use(protect);

router.post('/verify/code', verifyCode);
router.get( '/verify/resend', resendCode);

router.post('/register/complete/profile', completeProfile);

router.get('/logout', logout);

module.exports = router;
