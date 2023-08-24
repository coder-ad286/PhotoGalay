const express = require('express');
const app = express();
const dotenv = require('dotenv')
const path = require('path');
const connectDatabase = require('./config/db')
const authRoute = require('./route/auth')
const error = require('./middleware/error')
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())
dotenv.config({path:path.join(__dirname,'config','config.env')});

connectDatabase();

app.use(authRoute)
app.use(error)


app.listen(process.env.PORT,()=>{
    console.log(`Server is Running In ${process.env.PORT} Port...`);
})
