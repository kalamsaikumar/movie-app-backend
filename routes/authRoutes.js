const express = require('express');

const router = express.Router();

const {registerUser, loginUser,forgotPassword,resetPassword} = require('../controllers/authController');

router.get('/',(req,res)=>{
    res.send("Auth Routes are working Properly");
})

//REGISTER ROUTE
router.post('/register',registerUser);

//LOGIN ROUTE
router.post('/login',loginUser)

//FORGET PASSWORD ROUTE
router.post("/forgot-password",forgotPassword);

//RESET PASSWORD ROUTE
router.post("/reset-password",resetPassword);

module.exports = router