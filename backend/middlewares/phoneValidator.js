const { body, check } = require("express-validator");
const newUser = require("../MongoDb/models/userModels/User.js");

// Define an array of validation middleware functions for phone number validation
module.exports = [
  // Validate the 'phone' field
  check("phone").custom(async (value,{req}) => {
    console.log(req.body.phone)
    console.log(value)

    const user = await newUser.findOne({ phone: value });
    console.log(user)
    if (user) {
      throw new Error("Phone number already exists");
    }
    return true;
  }),
];
