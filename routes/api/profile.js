const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile model
const profile = require("../../models/Profile");

//Load user model
const user = require("../../models/User");

//load Profile validator module
const validateProfileInput = require("../../validator/profile");

//load Profile Experience validation module
const validateExperienceInput = require("../../validator/experience");

//load Profile Education validation module
const validateEducationInput = require("../../validator/education");

//@ route GET api/posts/test
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "profile works"
  })
);

//@ route GET api/profile/all
// @access  Public, should be able to see profiles.
//@desc get profile of all users

router.get("/all", (req, res) => {
  const errors = {};
  profile
    .find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "there are no profiles";

        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(errors =>
      res.status(404).json({ profile: "there are no profiles " })
    );
});

//@ route GET api/profile/handle/:handle
// @access  Public, should be able to see profiles.
//@desc get profile by handle

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  profile
    .findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(pfile => {
      if (!pfile) {
        errors.noprofile = "there is no profile with such handle";
        res.status(400).json(errors);
      }
      res.json(pfile);
    })
    .catch(errors => res.status(404).json(errors));
});

//@ route GET api/profile/user/:user_id
// @access  Public, should be able to see profiles.
//@desc get profile by handle

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  profile
    .findOne({ user: req.params.id })
    .populate("user", ["name", "avatar"])
    .then(pfile => {
      if (!pfile) {
        errors.noprofile = "there is no profile with such user id";
        res.status(400).json(errors);
      }
      res.json(pfile);
    })
    .catch(errors =>
      res.status(404).json({ profile: "there is no profile for such user::" })
    );
});

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
      .populate("user", ["name", "avatar"])
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

//@ route GET api/profile
// @access  Private
//@desc create user profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //get fields.
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills, split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    profile.findOne({ user: req.user.id }).then(pfile => {
      if (pfile) {
        //update the pfile
        profile
          .findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
          .then(pfile => {
            res.json(pfile);
          });
      } else {
        //create a profile

        //check if handle exists
        profile.findOne({ handle: profileFields.handle }).then(pfile => {
          if (pfile) {
            res.status(400).json(errors);
          }
          new profile(profileFields).save().then(pfile => {
            res.json(pfile);
          });
        });
      }
    });
    // .catch(err => res.status(404).json(err));

    if (req.body.handle) profileFields.handle = req.body.handle;
  }
);

//@ route GET api/profile/experience
// @access  Private
//@desc create user profile's experience

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    profile
      .findOne({ user: req.user.id })
      .then(pfile => {
        const newExpr = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        //add to experience array of the profile
        pfile.experience.unshift(newExpr);
        pfile.save().then(pfile => res.json(pfile));
      })
      .catch(err => res.status(404).json({ experience: "no excperince" }));
  }
);

//@ route delete api/profile/experience/:exp_id
// @access  Private
//@desc delt experience from profile

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profile
      .findOne({ user: req.user.id })
      .then(pfile => {
        //get remove index
        const removeIndex = pfile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //splice out of array
        pfile.experience.splice(removeIndex, 1);
        pfile.save().then(pfile => res.json({ msg: pfile }));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@ route delete api/profile/education/:edu_id
// @access  Private
//@desc delt experience from profile

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profile
      .findOne({ user: req.user.id })
      .then(pfile => {
        //get remove index
        const removeIndex = pfile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        //splice out of array
        pfile.education.splice(removeIndex, 1);
        pfile.save().then(pfile => res.json({ msg: pfile }));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@ route delete api/profile
// @access  Private
//@desc delt user and profile

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profile
      .findOneAndRemove({ user: req.user.id })
      .then(() => {
        user.findOneAndRemove({ _id: req.user.id }).then(() => {
          res.json({ success: true });
        });
      })
      .catch(err => res.status(404).json(err));
  }
);
module.exports = router;
