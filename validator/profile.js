const isempty = require("./is-empty");
const validator = require("validator");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isempty(data.handle) ? data.handle : "";

  data.status = !isempty(data.status) ? data.status : "";
  data.skills = !isempty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle needs to be required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Profile Status needs to be filled";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Profile skills needs to be filled";
  }

  if (!isempty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "not a valid url";
    }
  }
  if (!isempty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "not a valid url";
    }
  }
  if (!isempty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "not a valid url";
    }
  }
  if (!isempty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "not a valid url";
    }
  }
  if (!isempty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "not a valid url";
    }
  }
  if (!isempty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "not a valid url";
    }
  }

  return {
    errors,
    isValid: isempty(errors)
  };
};
