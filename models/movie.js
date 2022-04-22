const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0, //'min' assure that there are no negative numbers
      max: 255, // put the limit to 255 to prevente a malicious client to introduce a very large number that could break the APP
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0, //'min' assure that there are no negative numbers
      max: 255, // put the limit to 255 to prevente a malicious client to introduce a very large number that could break the APP
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(), // setting this property to 'genreId' and not 'genre' will force the Client to introduce the 'genreId' and not the 'genre'
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
