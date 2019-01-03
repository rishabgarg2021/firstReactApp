const isempty = require("./is-empty");
const validator = require("validator");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isempty(data.school) ? data.school : "";
  data.degree = !isempty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isempty(data.fieldofstudy) ? data.fieldofstudy : "";

  data.from = !isempty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "Job school field is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree field is required";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = " date from is required";
  }

  return {
    errors,
    isValid: isempty(errors)
  };
};
