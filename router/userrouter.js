const express = require('express');
const router = express.Router();
const {registerUser, LoginUser, getUser, verifyOtp, resendOtp} = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/verify', verifyOtp);
router.post('/resendotp', resendOtp);

router.get('/getuser', authenticate, getUser);

module.exports = router;