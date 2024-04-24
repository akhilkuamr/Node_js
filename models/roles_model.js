const mongoose = require("mongoose");
const rolesSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  role_desc: {
    type: String,
    required: true,
  },
  check_status: {
    type: String,
    required: true,
  },
});
const roles = mongoose.model("roles", rolesSchema);
module.exports = { roles };
