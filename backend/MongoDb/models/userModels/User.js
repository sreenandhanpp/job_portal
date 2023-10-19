//importing modules
const mongoose = require("mongoose");

//defining the structure of the collection
const newUserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  dob:{
    type:Date,
  },
  address: {
    pincode: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  password: {
    type: String,
  },
  admin: {
    type: Boolean,
  },
  cv: {
    type: String,
  },
});

//creating the model
const newUser = mongoose.model("user", newUserSchema);

module.exports = newUser;
