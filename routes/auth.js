const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const _ = require("lodash"); // it is used '_' by convention
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password.");
  }

  /* 'bcrypt' module to COMPARE the stored password
        '.compare': compare the password from 'req.body.password' to the 'user.password'
        '.compare' will 're-hash' the password so it can compare it with the user password
  */
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password.");
  }

  const token = user.generateAuthToken();
  res.send(token);
});

// Function that validate request authentication:
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(), //'.email()': assure that is a valide email address
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
