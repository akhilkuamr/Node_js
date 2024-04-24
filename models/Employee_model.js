const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const employeeSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});
employeeSchema.plugin(uniqueValidator);
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = { Employee };
