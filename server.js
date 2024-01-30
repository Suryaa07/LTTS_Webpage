const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  activated: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email service:", error);
  } else {
    console.log("Connected to email service");
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/register", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).send("All fields are mandatory.");
    }

    const user = new User({ name, email, phone });
    await user.save();

    const activationLink = `http://localhost:${port}/activate/${user._id}`;
    const mailOptions = {
      from: "suryaan007@gmail.com",
      to: email,
      subject: "Activate your account",
      text: `Click the following link to activate your account: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Check your email for activation link.");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send(`Failed to register. Error: ${error.message}`);
  }
});

app.get("/activate/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndUpdate(userId, { activated: true });
    res.send("Account activated successfully!");
  } catch (error) {
    console.error("Error during activation:", error);
    res.status(500).send(`Failed to activate account. Error: ${error.message}`);
  }
});

app.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.activated) {
      return res.status(400).send("User is not registered or not activated.");
    }

    res.redirect(`/welcome/${user._id}`);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send(`Failed to login. Error: ${error.message}`);
  }
});

app.get("/welcome/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    res.send(`Welcome ${user.name}!`);
  } catch (error) {
    console.error("Error during welcome:", error);
    res.status(500).send(`Failed to retrieve user. Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
