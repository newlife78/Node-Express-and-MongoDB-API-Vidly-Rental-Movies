const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  /* 
    . 'validateObjectId' middleware function responsible for:
        . Verify if 'req.params.id' is a valid id, before passing it (for example to '.findById' method in 'genres.js').
        . Otherwise we will never obtain '404' from this route handler. We would only obtain '500' error from 
          'error.js' middleware file.
  */

  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = new Genre({ name: req.body.name });
  await genre.save();

  res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("The gender with the given ID was not found.");
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  /*
    'auth' & 'amin' are 2 middleware functions.
    First is executed 'auth', if it pass this point, then it is executed the 2nd middleware func ('admin').
    Only if 'auth' & 'admin' are 'OK' => is 'async' func is executed.
  */
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  res.send(genre);
});

module.exports = router;
