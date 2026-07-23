const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require("../config/mail");

//REGISTER
const registerUser = async (req , res) =>{

    try {
        const {username,email,password} = req.body;

        //check if there are any empty fields
        if(!username || !email || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        //check if already the user exists

        const existingUser = await User.findOne({email : email});

        if(existingUser){
            return res.status(400).json({message : "user already exists"});
        }

        //Hash password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        //create a new user
        const newUser = await User.create({
            username : username,
            email : email,
            password : hashedPassword
        })

        await newUser.save();

        res.status(201).json({message : "user created successfully"});

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
    
}

//LOGIN
const loginUser = async (req , res) =>{
    try {
        const {email,password}=req.body;

        //check if user exists or not
        const user = await User.findOne({email : email});

        //if user credintals are wrong send a message
        if(!user){
            return res.status(400).json({message : "Invalid Email or Password"});
        }

        //compare password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Email or Password"});
        }

        //create a jwt token

        const token = jwt.sign(
            {
                id : user._id
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn : "7d"
            }
        )

        res.status(200).json({
            message : "Login Successful",
            token,
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : "Internal Server Error"})
    }
}

// FORGOT PASSWORD

const forgotPassword =
    async (req,res)=>{

        try{

            console.log(req.body);

            const { email } = req.body;

            // EMAIL CONTENT

            const mailOptions = {

                from:
                    process.env.EMAIL_USER,

                to: email,

                subject:
                    "MovieApp Password Reset",

                html:`

                    <h2>
                        Reset Your Password
                    </h2>

                    <p>
                        This mail is sent to you from Movie App. 
                        Click below link to reset password. 
                    </p>

                    <a href="http://localhost:5000/resetPassword.html?email=${email}">

                        Reset Password

                    </a>

                    <p> Thank You from Movie App </p>
                `
            };


            // SEND EMAIL

            await transporter.sendMail(
                mailOptions
            );

            res.status(200).json({

                message:
                    "Reset email sent successfully"
            });

        }catch(error){

            console.log(error);

            res.status(500).json({

                message:
                    "Email sending failed"
            });
        }
    };

// RESET PASSWORD

const resetPassword =
    async (req,res)=>{

        try{

            const {
                email,
                newPassword
            } = req.body;


            // FIND USER

            const user =
                await User.findOne({
                    email
                });

            if(!user){

                return res.status(404).json({

                    message:"User not found"
                });
            }


            // HASH NEW PASSWORD

            const salt =
                await bcrypt.genSalt(10);

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    salt
                );


            // UPDATE PASSWORD

            user.password =
                hashedPassword;

            await user.save();


            res.status(200).json({

                message:
                    "Password reset successful"
            });

        }catch(error){

            console.log(error);

            res.status(500).json({

                message:
                    "Server Error"
            });
        }
    };

module.exports = {registerUser,loginUser,forgotPassword,resetPassword};