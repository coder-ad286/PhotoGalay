const nodemailer=require('nodemailer');

exports.sendMail=async(option)=>{
    //CREATE TRANSPORTER
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port : 587,
        auth : {
            user : "growtech180@gmail.com",
            pass : "psdzhhrspsqyqvap"
        }
    })
    //DEFINE EMAIL OPTIONS
    const emailOptions={
        from : 'Grow Tech support<support@growtech180@gmail.com>',
        to : option.email,
        subject : option.subject,
        text : option.message
    }

    await transporter.sendMail(emailOptions)
}