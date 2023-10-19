const express = require("express");
const adminHelper = require("../helpers/adminHelper");
const router = express.Router();
const upload = require("../middlewares/multer");
const fs = require("fs");
const path = require("path");
// Handle POST request to create a new job
router.post("/create-job", upload.single("logo"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // Call the 'createJob' function from the 'adminHelper' module with the request body
  adminHelper
    .createJob(req.body, req.file)
    .then((resp) => {
      // If the job creation is successful, respond with a status code 200 and a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // If an error occurs during job creation, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle POST request to update a job
router.post("/update-job", upload.single("logo"), (req, res) => {
  console.log(req.body, req.file);
  // Call the 'updateJob' function from the 'adminHelper' module with the request body
  adminHelper
    .updateJob(req.body, req.file)
    .then((resp) => {
      // If the job update is successful, respond with a status code 200 and a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // If an error occurs during job update, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle DELETE request to delete a job
router.post("/delete-job", (req, res) => {
  // Call the 'deleteJob' function from the 'adminHelper' module with the request body
  adminHelper
    .deleteJob(req.body)
    .then((resp) => {
      // If the job deletion is successful, respond with a status code 200 and a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // If an error occurs during job deletion, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle GET request to retrieve all job applications
router.get("/applications", (req, res) => {
  // Call the 'getAllApplications' function from the 'adminHelper' module
  adminHelper
    .getAllApplications()
    .then((resp) => {
      // If the retrieval is successful, respond with a status code 200 and the retrieved data
      res.status(200).json(resp);
    })
    .catch((err) => {
      // If an error occurs during retrieval, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle GET request to retrieve all job applications
router.post("/get-job-details", (req, res) => {
  // Call the 'getAllApplications' function from the 'adminHelper' module
  adminHelper
    .getJobDetails(req.body)
    .then((resp) => {
      // If the retrieval is successful, respond with a status code 200 and the retrieved data
      res.status(200).json(resp);
    })
    .catch((err) => {
      // If an error occurs during retrieval, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

// Handle POST request to retrieve user details
router.post("/get-user", (req, res) => {
  // Call the 'getUserDetails' function from the 'adminHelper' module with the request body
  adminHelper
    .getUserDetails(req.body)
    .then((resp) => {
      // If user details retrieval is successful, respond with a status code 200 and the retrieved user data
      res.status(200).json(resp);
    })
    .catch((err) => {
      // If an error occurs during user details retrieval, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

router.post("/download", (req, res) => {
  console.log(req.body);
  adminHelper
    .getUserDetails(req.body)
    .then(async (resp) => {
      res.set({
        "Content-Type": "application/pdf",
      });
      file = await path.join(__dirname, "..", "uploads", resp.cv);
      console.log(file);
      res.sendFile(path.join(__dirname, "..", "uploads", resp.cv));
    })
    .catch((err) => {
      // If an error occurs during user details retrieval, respond with a status code 400 and an error message
      res.status(400).json({ message: err });
    });
});

router.post("/banner", upload.array("banners"), (req, res) => {
  adminHelper
    .createBanner(req.files)
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

module.exports = router;
