const express = require("express");
const router = express.Router();
const Employee = require("../Employee_model");
const bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  let userData = req.body;

  try {
    const employee = await Employee.findOne({ Email: userData.Email });

    if (!employee) {
      res.status(401).send("Invalid email");
    } else {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        userData.password,
        employee.Password
      );

      if (!passwordMatch) {
        // alert("Invalid Username and Password!! please check try again");
        res.status(401).send("Invalid password");
      } else {
        // Passwords match, create a JWT token
        let payload = { subject: employee._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token }); // Assuming you want to send the customer data on successful login
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
