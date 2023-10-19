// import express from 'express';
const express = require("express");
const userHelper = require("../helpers/userHelper");
const router = express.Router();
const emailValidator = require("../middlewares/emailValidator");
const upload = require("../middlewares/multer");
const { validationResult, body } = require("express-validator");
const phoneValidator = require("../middlewares/phoneValidator");
const {
  resendEmailOtp,
  resendPhoneOtp,
} = require("../helpers/userHelper/resendOtp");

//post signup route for form submition
// Handle POST request to register a user
router.post(
  "/register",
  // Middleware for phone and email validation
  upload.single("cv"), // Middleware for file upload
  (req, res) => {
    // Check for validation errors
    //   // Call the 'doRegister' function from the 'userHelper' module with request data and file
    userHelper
      .doRegister(req.body, req.file)
      .then((resp) => {
        console.log(resp);
        //       // If user registration is successful, respond with a status code 200 and a success message
        res.status(200).json(resp);
      })
      .catch((err) => {
        console.log(err);
        //       // If an error occurs during user registration, respond with a status code 400 and an error message
        res.status(401).json({ message: err });
      });
  }
);

// Handle POST request for user login
router.post("/login", (req, res) => {
  // Call the 'doLogin' function from the 'userHelper' module with request data
  userHelper
    .doLogin(req.body)
    .then((resp) => {
      // If login is successful, respond with a status code 200 and the response data
      res.status(200).json(resp);
    })
    .catch((err) => {
      // If an error occurs during login, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

router.get("/logout", (req, res) => {});

// Handle POST request to send an email OTP for verification
router.post("/send-email-otp", emailValidator, (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    // If there are validation errors, respond with a status code 400 and error messages
    res.status(400);
  } else {
    // Call the 'sendOtpVerificationEmail' function from the 'userHelper' module with request data
    userHelper
      .sendOtpVerificationEmail(req.body)
      .then((resp) => {
        // Respond with a 200 (OK) status and a success message when the email OTP is sent
        res.status(200).json(resp);
      })
      .catch((err) => {
        // Respond with a 401 (Unauthorized) status and an error message if there's an issue during the process
        res.status(401).json({ message: err });
      });
  }
});

//resending email otp route
router.post("/resend-email-otp", (req, res) => {
  resendEmailOtp(req.body)
    .then((resp) => {
      res.json(resp).status(200);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

// Handle POST request to verify an email OTP
router.post("/verify-email-otp", (req, res) => {
  // Call a function to verify the email OTP based on the request body
  userHelper
    .VerifyEmailOtp(req.body)
    .then((resp) => {
      // Update the user's email in the session and respond with a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      console.log(err);
      // Respond with a 401 (Unauthorized) status and an error message if verification fails
      res.status(401).json({ message: err });
    });
});

// Handle POST request to send an OTP to a phone number for verification
router.post("/send-phone-otp", phoneValidator, (req, res) => {
  // Validate the request data using the phoneValidator middleware
  const err = validationResult(req);

  // If there are validation errors in the request data
  if (!err.isEmpty()) {
    // Extract the validation errors and send a 401 (Unauthorized) response with the errors
    let errors = err.array();
    res.status(401).json({ error: errors });
  } else {
    // If there are no validation errors, proceed to send the phone OTP
    userHelper
      .sendPhoneOtpVerification(req.body)
      .then((resp) => {
        // Update the user's phone in the session and respond with a 200 (OK) success message
        res.status(200).json({ message: resp });
      })
      .catch((err) => {
        // Respond with a 401 (Unauthorized) status and an error message if OTP sending fails
        res.status(401).json({ message: err });
      });
  }
});

//resending phone otp route
router.post("/resend-phone-otp", (req, res) => {
  resendPhoneOtp(req.body)
    .then((resp) => {
      res.json({ message: resp }).status(200);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

// Handle POST request to verify a phone number OTP
router.post("/verify-phone-otp", (req, res) => {
  // Call a function to verify the phone number OTP based on the request body
  userHelper
    .VerifyPhoneOtp(req.body)
    .then((resp) => {
      // Update the user session with the response and respond with a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // Respond with a 401 (Unauthorized) status and an error message if verification fails
      res.status(401).json({ message: err });
    });
});

// Handle GET request to retrieve all available jobs
router.get("/get-all-jobs", (req, res) => {
  // Call the 'getAllJobs' function from the 'userHelper' module
  userHelper
    .getAllJobs()
    .then((resp) => {
      // If job retrieval is successful, respond with a status code 200 and the retrieved job data
      res.status(200).json(resp);
    })
    .catch((err) => {
      // If an error occurs during job retrieval, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle POST request to apply for a job
router.post("/apply", (req, res) => {
  console.log(req.body)
  // Call the 'applyJob' function from the 'userHelper' module with request data
  userHelper
    .applyJob(req.body)
    .then((resp) => {
      // If the job application is successful, respond with a status code 200 and a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // If there is an issue during the job application, respond with a 401 (Unauthorized) status and an error message
      res.status(401).json({ message: err });
    });
});

module.exports = router;
