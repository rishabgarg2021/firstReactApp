const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");
const app = express();

//db config
const db = require("./config/keys").mongoURI;

//connect to mongooseDB
mongoose
  .connect(db)
  .then(() => console.log("Mongo DB connected"))
  .catch(err => console.log(err), { useNewUrlParser: true });

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

app.get("/", function(req, res) {
  res.send("Hello World6!");
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Example app listening on port  ${port} !`));
