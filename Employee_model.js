const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  First_name: {
    type: String,
    required: true,
  },
  Job: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee };
