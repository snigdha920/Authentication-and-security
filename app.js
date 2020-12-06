//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

// Connect with monogdb
mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  User.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } 
    else {
      if (foundUser !== null) {
        let enteredPassword = md5(password);
        if (foundUser.password === enteredPassword) {
          res.render("secrets");
        } 
        else {
          console.log("Incorrect password");
        }
      }
      else {
        console.log("User not found");
      }
    }
  });
});

app.listen(3000, () => console.log("Server is up and running on port 3000."));
