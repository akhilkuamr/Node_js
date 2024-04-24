const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  First_name: {
    type: String,
    required: true,
  },
  Last_name: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  Address: {
    type: String,
    required: false,
  },
  Contact: {
    type: String,
    required: false,
  },
  City: {
    type: String,
    required: false,
  },
  Role: {
    type: String,
    required: false,
  },
  State: {
    type: String,
    required: false,
  },
  Visa_status: {
    type: String,
    required: false,
  },
  DOB: {
    type: String,
    required: false,
  },
  DOH: {
    type: String,
    required: false,
  },
  SSN: {
    type: String,
    required: false,
  },
  Zip: {
    type: String,
    required: false,
  },
  emp_status: {
    type: String,
    required: false,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer };
