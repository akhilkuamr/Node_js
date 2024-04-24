const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
  menu_name: {
    type: String,
    required: true,
  },
  menu_desc: {
    type: String,
    required: true,
  },
  Check_status: {
    type: String,
    required: true,
  },
});
const menu = mongoose.model("menu", menuSchema);
module.exports = { menu };
