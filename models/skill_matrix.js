const mongoose = require("mongoose");
const skillmatrixSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  skill_name: {
    type: String,
    required: true,
  },
  YOE: {
    type: String,
  },
  rating: {
    type: String,
  },
});
const Skillmatrix = mongoose.model("Skillmatrix", skillmatrixSchema);
module.exports = { Skillmatrix };
