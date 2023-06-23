require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const initializePassport = require("./passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id == id)
);

const app = express();
const users = [];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("dashboard.ejs");
});

app.get("/log", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send("Passwords do not match");
    return;
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred during registration");
      return;
    }

    const newUser = { firstName, lastName, email, password: hash };
    users.push(newUser);

    console.log(users);

    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
