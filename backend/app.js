//importing modules
const express = require('express');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoute.js');
const adminRoute = require('./routes/adminRoute.js');
const bodyParser = require('body-parser');
const connectDB = require('./MongoDb/connect.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session')
//configure the dotenv library
dotenv.config();

//taking the values from .env file
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

//creating the server from express library
const app = express();

//encoding the url to make the data passed through it to a object 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false 
}));
app.use(express.static('uploads'))

//seperates routes for normal user and admin(we call normal user as user )
app.use('/admin/api', adminRoute);
app.use('/user/api', userRoute);

//function to start the server
const StartServer = (MONGODB_URL) => {

    //passing mongoDB url to database connecting function
    connectDB(MONGODB_URL);
    //make the server to listen the port  
    app.listen(PORT, () => {
        console.log(`Server started ${PORT}`)
    });
};

StartServer(MONGODB_URL);
