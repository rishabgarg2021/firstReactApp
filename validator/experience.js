const isempty = require("./is-empty");
const validator = require("validator");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isempty(data.title) ? data.title : "";
  data.company = !isempty(data.company) ? data.company : "";
  data.from = !isempty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = " date from is required";
  }

  return {
    errors,
    isValid: isempty(errors)
  };
};
