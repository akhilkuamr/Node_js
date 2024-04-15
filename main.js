const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Customer } = require("./Customer_models"); // Assuming your model is named Customer
const app = express();

app.use(bodyParser.json());
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  optionSuccessStatus: 200,
};
app.options("*", cors());
app.use(cors(corsOptions));

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

app.get("/customers", async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    return res.status(200).json(allCustomers);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/fetch", async (req, res) => {
  try {
    const username = res.Email;
    const data = await Customer.findOne({ Email: username });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/customers", async (req, res) => {
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new Customer instance with the hashed password
    const newCustomer = new Customer({
      ...req.body,
      password: hashedPassword,
    });

    // Save the newCustomer to the database
    const insertedCustomer = await newCustomer.save();

    // Create a JWT token
    const payload = { subject: newCustomer._id };
    const token = jwt.sign(payload, "secretKey");

    return res.status(201).send({ token });
  } catch (error) {
    console.error("Error creating a new customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  let userData = req.body;

  try {
    const customer = await Customer.findOne({ Email: userData.Email });

    if (!customer) {
      res.status(401).send("Invalid email");
    } else {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        userData.password,
        customer.password
      );

      if (!passwordMatch) {
        // alert("Invalid Username and Password!! please check try again");
        res.status(401).send("Invalid password");
      } else {
        // Passwords match, create a JWT token
        let payload = { subject: customer._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token }); // Assuming you want to send the customer data on successful login
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.updateOne({ _id: id }, req.body);
    const updatedCustomer = await Customer.findById(id);
    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.status(200).json(deletedCustomer);
  } catch (error) {
    console.error("Error deleting customer by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/event", verifyToken, async (req, res) => {
  let events = [
    {
      id: "1",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2024-01-20T18:43:511Z",
    },
    {
      id: "2",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2024-01-20T18:43:511Z",
    },
    {
      id: "3",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2024-01-20T18:43:511Z",
    },
    {
      id: "4",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2024-01-20T18:43:511Z",
    },
    {
      id: "5",
      name: "Auto Expo",
      description: "lorem ipsum",
      date: "2024-01-20T18:43:511Z",
    },
  ];
  res.json(events);
});

const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydb");
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

start();
