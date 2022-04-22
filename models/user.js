const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
});

// Adding a method to 'userSchema':
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.VIDLY_JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// Joi-password-complexity module, for modeling password options
const complexityOptions = {
  min: 5,
  max: 255,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 5,
};

// Function that validate user:
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(), //'.email()': assure that is a valide email address
    password: passwordComplexity(complexityOptions).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
