const express = require('express');
const router = express.Router();
const {registerUser, LoginUser, changePass, delUser,getUser, verifyOtp, resendOtp, changeDetails} = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/verify', verifyOtp);
router.post('/resendotp', resendOtp);
router.post('/deluser', delUser);
router.post('/changepass', changePass);

router.put('/update-profile', changeDetails);

router.get('/getuser', getUser);

module.exports = router;