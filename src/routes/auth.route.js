const router = require('express').Router();
const {protect} = require('../utils/auth.token');
const {
    registerByEmail,
    verifyCode,
    completeProfile,
    createUsername,resendCode
} = require('../controllers/auth.controller');

router.post('/register/email', registerByEmail);
// router.post('/register/phone', registerByPhone);

router.use(protect);
router.post('/register/verify', verifyCode);
router.get('/register/verify/resend', resendCode);
router.post('/register/complete/profile', completeProfile);
router.post('/register/complete/profile/username', createUsername);
module.exports = router;
