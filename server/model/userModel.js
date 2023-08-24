const mongoose = require("mongoose");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Name : '],
        maxlength: [20, "Name only contail within 20 characters"],
        minlength: [3, "Name must be atleast 3 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                const regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
                return new RegExp(regex).test(email);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please Enter The Password...!"],
        minlength: [8, "Password Contain more than 7 character...!"],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date
})

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;