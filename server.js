const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Passport Config
require("./config/passport")(passport);

///////////////////////////////
////////EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

///////////////////////////////////////////
///////////////DB connection
mongoose
  .connect(process.env.DB_PASS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

///////////////////////////////////
// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//////////////////////////////////////////
/////////////////////ROUTES
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));

//////////////////////////////////////////////
//////////////////SERVER LISTENING
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`PORT IS RUNNIN ON PORT ${PORT}`);
});
