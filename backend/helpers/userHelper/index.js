const bcrypt = require("bcrypt");
const newUser = require("../../MongoDb/models/userModels/User.js");
const sendMail = require("../../middlewares/sendMail.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const userMailOtpSchema = require("../../MongoDb/models/userModels/mailOtp.js");
const userPhoneOtpSchema = require("../../MongoDb/models/userModels/phoneOtp.js");
const jobSchema = require("../../MongoDb/models/adminModels/Job.js");
const generateOtp = require("../../utils/generateOtp");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const springedge = require("springedge");
const applicationSchema = require("../../MongoDb/models/commonModels/applications.js");

dotenv.config();

module.exports = {
  // Function to register a user
  doRegister: (userData, file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the password using bcrypt, converting it into a secure hash value
        let password = await bcrypt.hash(userData.password, 10);
        console.log(userData);
        // Create a new 'user' document with the provided data
        const newData = await newUser.findOneAndUpdate(
          { _id: new ObjectId(userData.id) },
          {
            $set: {
              fullname: userData.fullname,
              address: {
                pincode: userData.pincode,
                state: userData.state,
                city: userData.city,
              },
              password: password,
              admin: false,
              dob: userData.dob,
              cv: file.filename,
              phone:userData.phone
            },
          },
          { new: true }
        );
        console.log("NewData" + newData);
        // Send an email confirmation to the user
        await sendMail(newData.email, userData.password);

        // Resolve with the user data
        resolve(newData);
      } catch (error) {
        console.log(error);
        reject("Something went wrong on creating account");
      }
    });
  },

  // Function to handle user login
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          userData.email === "admin@gmail.com" &&
          userData.password === "12345678"
        ) {
          // If the provided credentials match the admin's credentials
          const data = {
            username: "Admin",
            email: process.env.ADMIN_EMAIL,
            admin: true,
          };
          resolve(data);
        } else {
          // If not an admin login, find the user by their email
          const user = await newUser.findOne({ email: userData.email });

          // If the email is found, compare the provided password with the stored hash
          if (user) {
            let status = await bcrypt.compare(userData.password, user.password);
            if (status) {
              // If the password matches, provide user data for successful login
              const data = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                address: user.address,
                dob: user.dob,
                admin: user.admin,
                cv: user.cv,
                phone: user.phone,
              };
              resolve(data);
            } else {
              // If the password does not match, reject the login attempt
              reject();
            }
          } else {
            // If the email is not found, reject the login attempt
            reject();
          }
        }
      } catch (error) {
        console.log(error);
      }
      // Check if the user is attempting to log in as an admin
    });
  },

  //Function to send otp to user email
  sendOtpVerificationEmail: ({ id, email }) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(email);
        // Generate a random OTP
        const otp = await generateOtp();

        // Define the email content and options
        const mailOptions = {
          from: "sreenandhanpp@gmail.com",
          to: email,
          subject: "Verify Your Email",
          html: `<p>Enter <b>${otp}</b> in the app to verify your 
                            email address and complete the registration process</p>
                            <p>This code <b>expires in 1 hour</b>.</p>`,
        };

        // Create a transporter for sending emails using nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
          },
        });
        let user;
        if (!id) {
          const userData = new newUser({
            email: email,
          });
          user = await userData.save();
          console.log(user);
          // Hash the OTP for storage
        } else {
          user = await newUser.findOne({ _id: new ObjectId(id) });
        }
        console.log(user);
        const hashedOtp = await bcrypt.hash(otp, 10);
        try {
          const userOtp = new userMailOtpSchema({
            userId: new ObjectId(user._id),
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          const userOath = await userOtp.save();
          console.log(userOath);
        } catch (error) {
          console.error("Error saving userOath:", error);
        }
        // Send the OTP verification email
        await transporter.sendMail(mailOptions);

        // Resolve with a success message
        resolve(user);
      } catch (error) {
        console.log(error)
        // Reject with an error message if something goes wrong
        reject("Something went wrong,Request another OTP");

      }
    });
  },

  // Function to verify an email OTP and update the user's email if successful
  VerifyEmailOtp: ({ id, otp }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the user's OTP record in the database based on the user ID
        const user = await userMailOtpSchema.findOne({
          userId: new ObjectId(id),
        });

        // If the user record is not found, reject with an error message
        if (!user) {
          reject("User not found");
        } else {
          const { expiresAt } = user.expiresAt;
          const hashedOtp = user.otp;

          // Check if the OTP has expired
          if (expiresAt < Date.now()) {
            // If expired, delete the OTP record and reject with an error message
            await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
            reject("Code has expired. Please request again");
          } else {
            // Compare the provided OTP with the hashed OTP in the database
            const validOtp = await bcrypt.compare(otp, hashedOtp);

            // If the OTP is invalid, reject with an error message
            if (!validOtp) {
              reject("Invalid code please check your inbox");
            } else {
              // If the OTP is valid, delete the OTP record and update the user's email
              userMailOtpSchema
                .deleteOne({ userId: new ObjectId(id) })
                .then(() => {
                  // After deleting the document, update the other collection
                  // Resolve with the updated email
                  resolve("Email verified successfully");
                })
                .catch((error) => {
                  // Handle errors here
                  reject("Error updating email");
                });
            }
          }
        }
      } catch (error) {
        reject("something went wrong on verifing email,please try again");
      }
    });
  },

  // Function to send an OTP to a phone number for verification
  sendPhoneOtpVerification: ({ id, phone }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate a random OTP
        const otp = await generateOtp();

        // Configure parameters for sending SMS using the Spring Edge API
        var params = {
          apikey: process.env.SPRING_EDGE_API_KEY, // API Key
          sender: "SEDEMO", // Sender Name
          to: [
            `${phone}`, //Moblie Number
          ],
          message: `Hello ${otp}, This is a test message from spring edge`,
          format: "json",
        };

        // Send the SMS message using Spring Edge API
        await springedge.messages.send(params, 5000, function (err, response) {
          if (err) {
            // If there's an error sending the SMS, throw an error
            throw "something went wrong, Can't send otp right now";
          }
        });

        // Hash the OTP for storage
        const hashedOtp = await bcrypt.hash(otp, 10);
        const userData = newUser.findOne({ _id: new ObjectId(id) });
        if (!userData.phone) {
          await newUser.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: {
                phone: {
                  phone_num: phone,
                  verified: false,
                },
              },
            }
          );
        }
        // Create a record of the OTP in the database
        const userOtp = new userPhoneOtpSchema({
          userId: id,
          otp: hashedOtp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });

        // Save the OTP record to the database
        const res = await userOtp.save();
        resolve("Otp sended successfully");

        // Resolve with a success message
      } catch (error) {
        console.log(error);
        // Reject with an error message if something goes wrong
        reject("Something went wrong,Request another OTP");
      }
    });
  },

  // Function to verify a phone number OTP and update the user's phone number if successful
  VerifyPhoneOtp: ({ id, otp }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the user's OTP record in the database based on the user ID
        const user = await userPhoneOtpSchema.findOne({
          userId: new ObjectId(id),
        });

        // If the user record is not found, reject with an error message
        if (!user) {
          reject("User not found");
        } else {
          const { expiresAt } = user.expiresAt;
          const hashedOtp = user.otp;

          // Check if the OTP has expired
          if (expiresAt < Date.now()) {
            // If expired, delete the OTP record and reject with an error message
            await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
            reject("Code has expired. Please request again");
          } else {
            // Compare the provided OTP with the hashed OTP in the database
            validOtp = await bcrypt.compare(otp, hashedOtp);

            // If the OTP is invalid, reject with an error message
            if (!validOtp) {
              reject("Invalid code please check your inbox");
            } else {
              // If the OTP is valid, delete the OTP record and update the user's phone number
              userPhoneOtpSchema
                .deleteOne({ userId: new ObjectId(id) })
                .then(() => {
                  // After deleting the document, update the other collection
                  return newUser.updateOne(
                    { _id: new ObjectId(id) },
                    {
                      $set: {
                        "phone.verified": true,
                      },
                    }
                  );
                })
                .then((updateResult) => {
                  // Resolve with the updated email
                  resolve("Email verified successfully");
                })
                .catch((error) => {
                  // Handle errors here
                  reject("Error updating email");
                });
              // Resolve with the updated phone number
              resolve("Phone number verified Successfully");
            }
          }
        }
      } catch (error) {
        reject("something went wrong on verifiying otp");
      }
    });
  },

  // Function to apply for a job
  applyJob: ({ userId, job_id, company_name, designation }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user has any previous applications
        const isAppliedExist = await applicationSchema.findOne({
          userId: new ObjectId(userId),
        });

        if (isAppliedExist) {
          // If the user has previous applications, check if they have already applied for this job
          const isApplied = await applicationSchema.findOne({
            userId: new ObjectId(userId),
            "jobDetails.job_id": new ObjectId(job_id),
          });

          if (isApplied) {
            resolve("You already applied for this job");
          } else {
            // Update the user's existing application with the new job details
            applicationSchema
              .updateOne(
                {
                  userId: new ObjectId(userId),
                },
                {
                  $push: {
                    jobDetails: [
                      {
                        job_id: new ObjectId(job_id),
                        company_name: company_name,
                        designation: designation,
                      },
                    ],
                  },
                }
              )
              .then(() => {
                resolve("Job application sent successfully");
              });
          }
        } else {
          // If the user has no previous applications, create a new application document
          const application = new applicationSchema({
            userId: new ObjectId(userId),
            jobDetails: [
              {
                job_id: new ObjectId(job_id),
                company_name: company_name,
                designation: designation,
              },
            ],
          });

          application
            .save(application)
            .then((res) => {
              resolve("Job application sent successfully");
            })
            .catch((err) => {
              reject("Something went wrong on sending job application");
            });
        }
      } catch (error) {
        reject("Something went wrong on sending job application");
      }
    });
  },

  // Function to retrieve all job records
  getAllJobs: () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find and retrieve all job records from the database
        jobSchema
          .find()
          .then((res) => {
            // If the retrieval is successful, resolve with the job records
            resolve(res);
          })
          .catch((err) => {
            // If an error occurs during job record retrieval, reject with an error message
            reject("Something went wrong on fetching job records");
          });
      } catch (error) {
        console.log(error);
        // Handle any unexpected errors and reject with an error message
        reject("Something went wrong on fetching job records");
      }
    });
  },
};
