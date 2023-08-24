const { sendMail } = require('../helper/email');
const { generateJWT } = require('../helper/jwt');
const users = require('../model/userModel');
const ErrorHandler = require('../utils/ErrorHandler')
const crypto = require('crypto');
const catchAsyncError = require('../middleware/async')


exports.register=catchAsyncError(async(req,res,next)=>{
    const {name,username,password}=req.body;

    if(!name&&!username&&!password){
        return next(new ErrorHandler("All Fields Are Required...!",400))
    }
    const userExits = await users.findOne({email:username});

    //check user already exits
    if(userExits){
        return next(new ErrorHandler("Entered Email Is Already Registered",400))
    }

    await users.create({
        name,
        email:username,
        password
    })



    res.status(201).json({
        sucess:true,
        message:"User Created Succesfully"
    })
})

exports.login=catchAsyncError(async(req,res,next)=>{

    const {username,password}=req.body;

    if(!username&&!password){
        return next(new ErrorHandler("All Fields Are Required...!",400))
    }
    const user = await users.findOne({email:username});

    //check user  exits
    if(!user){
        return next(new ErrorHandler("Invalid Username or Password...!",400))
    }

    if(!(user.password===password)){
        return next(new ErrorHandler("Invalid Username or Password...!",400))
    }

    const token = generateJWT({id:user._id});

    //store token in cookies
    res.status(200)
    .cookie("token",token,{
        expires:new Date(Date.now()+2+24*60*60*1000),
        httpOnly :true
    })
    .json({
        sucess : true,
        token 
    })
})

exports.profile=catchAsyncError((req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        user 
    })
})

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{
    //1.GET EMAIL FROM USER REQ
    const {email}=req.body;
    if(!email){
        return next(new ErrorHandler("Please Enter Your Email",400))
    }
    const user = await users.findOne({email});
    if(!user){
        return next(new ErrorHandler("Invalid Email",400))
    }

    //2.GENERATE TOKEN
    const resetToken = user.createResetPasswordToken();
    console.log(resetToken);
    await user.save({validateBeforeSave:false});

    //3.SEND TOKEN TO EMAIL
    const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`
    const message =`We heave received the password reset request.Please use below link to resetyour password\n\n${resetURL}\n\nThis Reset password link will be valid only for 10minutes`
    
    try {
        await sendMail({
            email : user.email,
            subject : "Password Change",
            message:message,    
        });
        res.status(201).json({
            sucess : true,
            message : "Password Reset Link Send Succesfully",
        })
        
    } catch (error) {
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});

        console.log(error);
        return next(new ErrorHandler("There was an sending password reset email ",500))
    }

    
})

exports.resetPassword=catchAsyncError(async(req,res,next)=>{

     //GET PASSWORD AND CONFIRM PASSWORD
     const {password,confirmPassword}=req.body;

     if(!password||!confirmPassword){
         return next(new ErrorHandler("Please Enter Password And Confirm Password",400))
     }
 
     if(password!==confirmPassword){
         return next(new ErrorHandler("Password Does Not Match",400))
     }

    //FIND USER USING TOKEN MATCH AND WITHIN EXPIRE TIME
    const token =crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user =await users.findOne({
        passwordResetToken:token,
        passwordResetTokenExpires : {$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("The Token Is Wrong or Expire Please Check...!",400))
    }

    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    user.password = password;
    await user.save({validateBeforeSave:false});
   
    res.status(200).json({
        sucess : true,
        message : "Password Changed Succesfully"
    })
})

exports.logout=catchAsyncError(async(req,res,next)=>{
    res.cookie("token",'',{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success : true,
        message :"Logged Out"
    })
})