const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const msal = require("@azure/msal-node");
const cors = require("cors");
const { Customer } = require("./models/Customer_models");
const { Employee } = require("./models/Employee_model");
const { Google } = require("./models/google_models");
const { Skill } = require("./models/skill_model");
const { Skillmatrix } = require("./models/skill_matrix");
const { roles } = require("./models/roles_model");
const { menu } = require("./models/menu_model");
const { Action } = require("./models/action_model");
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
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `FunOfHeuristic_${file.originalname}`);
  },
});

var upload = multer({ storage: storage });

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

app.get("/fetchdata", async (req, res) => {
  const userId = req.query.param1;
  try {
    const data = await Customer.findOne({ Email: userId });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCustomer = new Customer({
      ...req.body,
      password: hashedPassword,
    });
    const insertedCustomer = await newCustomer.save();
    const payload = { subject: newCustomer._id };
    const token = jwt.sign(payload, "secretKey", { expiresIn: "1hr" });
    return res.status(201).send({ token });
  } catch (error) {
    console.error("Error creating a new customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/google", async (req, res) => {
  try {
    const newGoogle = new Google({
      ...req.body,
    });
    const insertedCustomer = await newGoogle.save();
    return res.status(201);
  } catch (error) {
    console.error("Error creating a new customer:", error);
    //return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  let userData = req.body;

  try {
    const customer = await Customer.findOne({ Email: userData.Email });

    if (!customer) {
      res.status(401).send("Invalid email");
    } else {
      const passwordMatch = await bcrypt.compare(
        userData.password,
        customer.password
      );
      if (!passwordMatch) {
        res.status(401).send("Invalid password");
      } else {
        let payload = { subject: customer._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login2", async (req, res) => {
  let userData = req.body;
  //console.log("137", userData);
  const msalConfig = {
    auth: {
      clientId: "7cf093ac-4845-4158-b9ee-3c3bc5f9dff9",
      //client_secret: "4c8d7f27-43d4-4db6-812c-ccd404b1d546",
      authority:
        "https://login.microsoftonline.com/36b2f884-33d8-4af6-826f-434a33d002f9",
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          //console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      },
    },
  };

  const pca = new msal.PublicClientApplication(msalConfig);
  const msalTokenCache = pca.getTokenCache();
  //console.log("164");
  const tokenCalls = async () => {
    async function getAccounts() {
      return await msalTokenCache.getAllAccounts();
    }

    accounts = await getAccounts();
    const usernamePasswordRequest = {
      scopes: [""],
      username: req.body.Email, // Add your username here
      password: req.body.password, // Add your password here
    };

    pca
      .acquireTokenByUsernamePassword(usernamePasswordRequest)
      .then((response) => {
        //console.log("acquired token by password grant", response);
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  tokenCalls();
});

app.put("/customers/update", async (req, res) => {
  try {
    const userId = req.query.param1;
    const newData = req.body;
    //await Customer.findByIdAndUpdate({ Email: id }, req.body);
    const updatedCustomer = await Customer.updateOne(
      { Email: userId },
      newData
    );
    const data = await Customer.find({ Email: userId });
    return res.status(200).json(data);
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

app.post("/fetch", async (req, res) => {
  const userdata = req.body;
  try {
    const user = await Employee.findOne({ Email: userdata.Email });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.Password === userdata.password) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// -------------------------------------------

app.post("/skill", async (req, res) => {
  try {
    const newSkill = new Skill({
      ...req.body,
    });
    const insertedCustomer = await newSkill.save();
    const data = await Skill.find();
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json(data);
    //return res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error creating a new customer:", error);
  }
});

app.get("/skillmatrix", async (req, res) => {
  try {
    const allskills = await Skill.find();
    return res.status(200).json(allskills);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/skillmatrix1", async (req, res) => {
  try {
    const newSkill = new Skillmatrix({
      ...req.body,
    });
    const insertedCustomer = await newSkill.save();
    const data = await Skillmatrix.find({ user_id: insertedCustomer.user_id });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error creating a new customer:", error);
  }
});

app.get("/skillmatrix/getdata", async (req, res) => {
  const userId = req.query.param1;
  try {
    const data = await Skillmatrix.find({ user_id: userId });
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/file", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully.");
});

app.get("/roles", async (req, res) => {
  try {
    const allroles = await roles.find();
    return res.status(200).json(allroles);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const allroles = await menu.find();
    return res.status(200).json(allroles);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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

module.exports = app;
