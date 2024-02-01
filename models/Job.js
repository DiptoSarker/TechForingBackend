const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
  jobname: String,
  password: String,
});

// Define User Model
const Job = mongoose.model("Job", userSchema);

module.exports = Job;
