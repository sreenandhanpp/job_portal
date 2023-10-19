//importing modules
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//defining the structure of the collection
const schema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    unique: true,
  },
  jobDetails: [
    {
      job_id: {
        type: ObjectId,
        required: true,
      },
      company_name: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
    },
  ],
});

//creating the model
const applicationSchema = mongoose.model("applications", schema);

module.exports = applicationSchema;
