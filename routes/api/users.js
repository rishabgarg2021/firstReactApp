const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// Load User model

const User = require("../../models/User");
const gravatar = require("gravatar");

//@ route GET api/users/test
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "users works"
  })
);

//@ route GET api/users/register
// @access  Public
router.post("/register", (req, res) =>
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(console.log(err));
        });
      });
    }
  })
);

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      return res.status(404).json({
        email: "Email not registered"
      });
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "Success" });
      } else {
        res.status(400).json({ password: "Incorrect password" });
      }
    });
  });
});

module.exports = router;
