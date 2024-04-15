const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_URI = "mongodb://localhost:27017/mydb";

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

console.log("connected!!!!!!");

console.log(db.listCollections());
