const express = require("express");

const { check, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

//route to register a user
router.post(
  "/",
  [
    check("userName", "user Name is required")
      .not()
      .isEmpty()
      .custom(value => !/\s/.test(value))
      .withMessage('No spaces are allowed in the username'),
    check("email", "Please enter a valid email Address").isEmail(),
    check("password", "pass min 8 char").isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      userType,
      userName,
      email,
      password
    } = req.body;

    try {
      let user = await User.findOne({ userName });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "username already in use" }] });
      }

      user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "email already in use" }] });
      }

      user = new User({
        userType,
        userName,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          userType: user.userType
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;