const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

mongoose
  .connect("mongodb://localhost:27017/loginDemo", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

// We need to parse the body to get the information of the form register
app.use(express.urlencoded({ extended: true }));

// After we require express-session
// Config the secret key of the express session, and remove the messages that show up when we start the application
const sessionOptions = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));

// Home Page to redirect user
app.get("/", (req, res) => {
  res.send("THIS IS THE HOME PAGE, GO TO /LOGIN");
  //   setTimeout(() => {
  //     res.redirect("/login");
  //   }, 5000);
});

// The route to user informs the data we need
app.get("/register", (req, res) => {
  res.render("register");
});

// The route to post the information of the register
app.post("/register", async (req, res) => {
  // Verify if the body is being parsed using req.body
  //   res.send(req.body);
  // After the test to see if the body is being parsed, we need to get the information and create a new user
  //   Using bcrypt and hash on psw
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);
  //   We verify if the password has been hashed
  //   res.send(hash);
  // If the hash worked, we can create a new user using the hash
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/login");
});

// Creating the route login to log the user
app.get("/login", (req, res) => {
  res.render("login");
});

// Creating the post request to authenticate user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  //   We never give a hint of what's information is wrong, better say that some of then is incorrect
  // But we can compare if the username must be unique
  //   if(!user)
  const validPassword = await bcrypt.compare(password, user.password);
  //   Now we create the conditionals
  if (validPassword) {
    req.session.user_id = user._id;
    // res.send("LOGIN SUCCESSFULLY");
    res.redirect("/secret");
  } else {
    // res.send("TRY AGAIN");
    res.redirect("/login");
  }
});

// The route we will be protected
app.get("/secret", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  res.send("This Is the Secret");
});

app.listen(3000, () => {
  console.log("Listen on Port 3000");
});
