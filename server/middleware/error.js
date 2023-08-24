module.exports=(err,req,res,next)=>{
    res.status(err.statusCode).json({
        sucess: false,
        message:err.message,
        stack:err.stack
    });
}