mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

//create a model using this schema
var User = mongoose.model("User", userSchema);

module.exports = User;
