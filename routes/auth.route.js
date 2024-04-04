const router = require('express').Router();
const {initialRegister} = require('../controllers/auth.controller');

router.post('/register/initial/:method', initialRegister);

module.exports = router;
