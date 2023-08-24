const users = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require('jsonwebtoken');

exports.authenicate=async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("Login to Continue..",400))
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY);

    if(!decoded){
        return next(new ErrorHandler("Login to Continue..",400))
    }

    req.user = await users.findById(decoded.data.id);
    next();
}