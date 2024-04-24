const mongoose = require("mongoose");
const actionSchema = new mongoose.Schema({
  action_name: {
    type: String,
    required: true,
  },
  action_desc: {
    type: String,
    required: true,
  },
  check_status: {
    type: String,
    required: true,
  },
});
const actions = mongoose.model("actions", actionSchema);
module.exports = { actions };
