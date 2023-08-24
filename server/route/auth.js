const express = require('express');
const { register, login, logout, profile, forgotPassword, resetPassword } = require('../controller/authCtrl');
const { authenicate } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login);
router.route('/profile').get(authenicate,profile);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/logout').post(logout)

module.exports=router;