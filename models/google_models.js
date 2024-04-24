const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const googleSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    //unique: true,
  },
  idToken: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
    //unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
    //unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
});
googleSchema.plugin(uniqueValidator);
const Google = mongoose.model("Google", googleSchema);
module.exports = { Google };
