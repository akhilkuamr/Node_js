const mongoose = require("mongoose");
const recordSchema = new mongoose.Schema({
  file_name: {
    type: String,
  },
  file_size: {
    type: String,
  },
  file_type: {
    type: String,
  },
  filedata: {
    type: String,
  },
  last_updated: {
    type: Date,
  },
});
const records = mongoose.model("records", recordSchema);
module.exports = { records };
