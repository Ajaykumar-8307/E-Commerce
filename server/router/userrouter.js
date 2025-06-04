const express = require('express');
const router = express.Router();
const {registerUser, LoginUser, getUser, verifyOtp} = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/verify', verifyOtp);

router.get('/getuser', authenticate, getUser);

module.exports = router;