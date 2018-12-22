const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//db config
const db = require("./config/keys").mongoURI;

//connect to mongooseDB
mongoose
  .connect(db)
  .then(() => console.log("Mongo DB connected"))
  .catch(err => console.log(err), { useNewUrlParser: true });

app.get("*", function(req, res) {
  console.log(req);

  res.send("hello World!");
});

//Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

app.get("/", function(req, res) {
  console.log(req);
  res.send("Hello World6!");
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Example app listening on port  ${port} !`));
