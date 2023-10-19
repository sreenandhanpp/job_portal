//importing modules
const mongoose = require("mongoose");

//defining the structure of the collection
const schema = new mongoose.Schema({
    location:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    vacancy:{
        type:Number,
        required:true
    },
    company_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    qualifications:{
        type:String,
        required:true
    },
    dateline:{
        type:Date,
        required:true
    },
    postedDate:{
        type:Date,
        required:true
    },
    company_logo:{
        type:String,
        required:true
    },

});

//creating the model
const jobSchema = mongoose.model("job", schema);

module.exports = jobSchema;
