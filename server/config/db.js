const { log } = require("console");
const mongoose = require("mongoose");
const path = require('path')

const connectDatabase = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(()=>{
        console.log("Database Connected Succesfully");
    }).catch(()=>{
        console.log("Databaseconnection Failed...!");
    })
}

module.exports=connectDatabase;