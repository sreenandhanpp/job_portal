const { body } = require("express-validator");
const newUser = require("../MongoDb/models/userModels/User.js");

// Define an array of validation middleware functions for email validation
module.exports = [
  // Validate the 'email' field
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(async (value) => {
      // Check if an existing user with the same email exists in the database
      const existingUser = await newUser.findOne({ email: value }).exec();

      // If an existing user is found, throw an error indicating that the email already exists
      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Return true if validation passes
      return true;
    }),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isMobilePhone("en-IN", { strictMode: false })
    .withMessage("Invalid phone number format")
    .bail()
    .custom(async (value) => {
      // Check if an existing user with the same phone number exists in the database
      const existingNumber = await newUser.findOne({ phone: value }).exec();

      // If an existing phone number is found, throw an error indicating that it already exists
      if (existingNumber) {
        throw new Error("Phone number already exists");
      }

      // Return true if validation passes
      return true;
    }),
];
