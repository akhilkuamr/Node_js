const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  First_name: {
    type: String,
    required: true,
  },
  Last_name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer };
