const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile model
const profile = require("../../models/Profile");

//Load user model
const user = require("../../models/User");

//@ route GET api/posts/test
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "profile works"
  })
);

//@ route GET api/profile
// @access  Private
//@desc get current user information profile(the user which is log in and its token payload is checked.)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const error = {};
    profile
      .findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile of the user";
          return res.json(404).res(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
