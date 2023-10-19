//importing modules
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//defining the structure of the collection
const schema = new mongoose.Schema({
  banner_one:{
    type:String
  },
  banner_two:{
    type:String
  },
  banner_three:{
    type:String
  },
});

//creating the model
const bannerSchema = mongoose.model("banners", schema);

module.exports = bannerSchema;
