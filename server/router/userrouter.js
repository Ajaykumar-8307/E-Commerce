const express = require('express');
const router = express.Router();
const {registerUser, LoginUser, getUser} = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.get('/getuser', authenticate, getUser);

module.exports = router;