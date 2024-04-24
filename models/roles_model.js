const mongoose = require("mongoose");
const rolesSchema = new mongoose.Schema({
  role_name: {
    type: String,
  },
  role_desc: {
    type: String,
  },
  check_status: {
    type: String,
  },
  display_menu: {
    type: Array,
  },
});
const roles = mongoose.model("roles", rolesSchema);
module.exports = { roles };
