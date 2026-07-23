// const jwt = require('jsonwebtoken');

// const authMiddleware = (req,res,next) => {
//     try {

//         const token = req.headers.authorization ; 

//         //if no token is provided
//         if(!token){
//             return res.status(401).json({
//                 message : "No token provided"
//             })
//         }

//         //verify token with secret key provided in env file.this secret key acts like signature
//         const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);   //here decoded contains payload i.e data

//         req.user = decoded;     //Attach user data to the request. Now every route can access the logged in user for 7 days i.e (expriresIn value)

//         next();
        
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({
//             message : "Invalid token"
//         })
//     }
// }

// module.exports = authMiddleware

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token) {

            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;