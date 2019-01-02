const isempty = require("./is-empty");
const validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isempty(data.name) ? data.name : "";
  data.email = !isempty(data.email) ? data.email : "";
  data.password = !isempty(data.password) ? data.password : "";
  data.password2 = !isempty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be 2 or 30 characters less";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Valid Email is required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!(validator.isLength(data.password), { min: 6, max: 30 })) {
    errors.password =
      "Password should be more than 6 and less than 30 characters";
  }

  //   if (validator.isEmpty(data.password2)) {
  //     errors.password = "Confirm Password is required";
  //   }

  //   if (!validator.equals(data.password, data.password2)) {
  //     console.log(data.password, data.password2);
  //     errors.password = "Passwords don't match";
  //   }

  return {
    errors,
    isValid: isempty(errors)
  };
};
