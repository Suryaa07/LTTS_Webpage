const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
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
    user: "suryaan007@gmail.com", 
    pass: "omlm tysz virr lxwc", 
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/register", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send("All fields are mandatory.");
  }

  const user = new User({ name, email, phone });
  await user.save();

  const activationLink = `http://localhost:3000/activate/${user._id}`;
  const mailOptions = {
    from: "suryaan007@gmail.com",
    to: email,
    subject: "Activate your account",
    text: `Click the following link to activate your account: ${activationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send(`Failed to send activation email. Error: ${error.message}`);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Check your email for activation link.");
    }
  });
  
});

app.get("/activate/:id", async (req, res) => {
  const userId = req.params.id;

  await User.findByIdAndUpdate(userId, { activated: true });

  res.send("Account activated successfully!");
});

app.post("/login", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.activated) {
    return res.status(400).send("User is not registered or not activated.");
  }

  res.redirect(`/welcome/${user._id}`);
});

app.get("/welcome/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  res.send(`Welcome ${user.name}!`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
