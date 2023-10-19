const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jobSchema = require("../../MongoDb/models/adminModels/Job");
const bcrypt = require("bcrypt");
const applicationSchema = require("../../MongoDb/models/commonModels/applications");
const newUser = require("../../MongoDb/models/userModels/User");
const formatDateWithoutTimezone = require("../../utils/formatDate");
const bannerSchema = require("../../MongoDb/models/adminModels/banner");

module.exports = {
  // Function to create a job in the database
  createJob: (
    {
      company_name,
      designation,
      vacancy,
      location,
      description,
      dateline,
      qualifications,
    },
    file
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(file);
        // Create a new 'job' document using the provided parameters
        const job = new jobSchema({
          company_name: company_name,
          designation: designation,
          vacancy: vacancy,
          location: location,
          description: description,
          qualifications: qualifications,
          postedDate: await formatDateWithoutTimezone(),
          dateline: dateline,
          company_logo: file.filename,
        });

        // Save the 'job' document to the database
        job
          .save(job)
          .then((resp) => {
            // If job creation is successful, resolve with a success message
            resolve("Job created Successfully");
          })
          .catch((err) => {
            console.log(err);
            // If an error occurs during job creation, reject with an error message
            reject("Something went wrong on creating Job");
          });
      } catch (error) {
        console.log(error);
        reject("something went wrong on creating job");
      }
    });
  },

  // Function to update a job in the database
  updateJob: (body, file) => {
    return new Promise(async (resolve, reject) => {
      // Update the 'jobSchema' document with the provided parameters using 'updateOne'
      console.log(body, file);
      if (file) {
        body.company_logo = file.path;
      }
      jobSchema
        .updateOne(
          { _id: new ObjectId(body.id) },
          {
            $set: body,
          }
        )
        .then((res) => {
          console.log(res);
          // If the job update is successful, resolve with a success message
          resolve("Job updated successfully");
        })
        .catch((err) => {
          // If an error occurs during job update, reject with an error message
          reject("Something went wrong on updating Job");
        });
    });
  },

  // Function to delete a job from the database
  deleteJob: ({ id }) => {
    console.log(id);
    return new Promise(async (resolve, reject) => {
      // Delete the 'jobSchema' document with the provided 'id' using 'deleteOne'
      jobSchema
        .deleteOne({ _id: new ObjectId(id) })
        .then((res) => {
          console.log(res);
          // If the job deletion is successful, resolve with a success message
          resolve("Job deleted successfully");
        })
        .catch((err) => {
          // If an error occurs during job deletion, reject with an error message
          reject("Something went wrong on deleting Job");
        });
    });
  },
  getJobDetails: ({ id }) => {
    return new Promise(async (resolve, reject) => {
      // Delete the 'jobSchema' document with the provided 'id' using 'deleteOne'
      jobSchema
        .findOne({ _id: new ObjectId(id) })
        .then((res) => {
          // If the job deletion is successful, resolve with a success message
          resolve(res);
        })
        .catch((err) => {
          // If an error occurs during job deletion, reject with an error message
          reject("Something went wrong on deleting Job");
        });
    });
  },

  // Function to retrieve all job applications from the database
  getAllApplications: () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Use aggregation to collect application data
        applicationSchema
          .aggregate([
            {
              $unwind: "$jobDetails",
            },
            {
              $project: {
                userId: 1,
                jobDetails: 1,
              },
            },
          ])
          .then((res) => {
            // If the retrieval is successful, resolve with the collected application data
            resolve(res);
          })
          .catch((err) => {
            // If an error occurs during application collection, reject with an error message
            reject("Something went wrong on collecting applications");
          });
      } catch (error) {
        // Handle any unexpected errors and reject with an error message
        reject("Something went wrong on collecting applications");
      }
    });
  },

  // Function to retrieve user details from the database
  getUserDetails: ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find a user document with the provided 'id'
        newUser
          .findOne({ _id: new ObjectId(id) })
          .then((res) => {
            // If user details retrieval is successful, resolve with the user data
            resolve(res);
          })
          .catch((err) => {
            // If an error occurs during user details collection, resolve with an error message
            resolve("Something went wrong on collecting user details");
          });
      } catch (error) {
        // Handle any unexpected errors and resolve with an error message
        resolve("Something went wrong on collecting user details");
      }
    });
  },
  // Function to retrieve user details from the database
  createBanner: (files) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find a user document with the provided 'id'
        const banners = new bannerSchema({
          banner_one: files[0].filename,
          banner_two: files[1].filename,
          banner_three: files[2].filename,
        });
        banners
          .save()
          .then((res) => {
            resolve("Banners created successfully");
          })
          .catch((err) => {
            resolve("Something went wrong on creating banner");
          });
      } catch (error) {
        // Handle any unexpected errors and resolve with an error message
        resolve("Something went wrong on creating banner");
      }
    });
  },
};
