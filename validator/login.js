const isempty = require("./is-empty");
const validator = require("validator");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isempty(data.email) ? data.email : "";
  data.password = !isempty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Valid Email is required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isempty(errors)
  };
};
