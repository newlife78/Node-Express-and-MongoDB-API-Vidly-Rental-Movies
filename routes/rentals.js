const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

module.exports = router;

/*  . NOTES:
        . Assuring that 'rental.save()' and 'movie.save()' are both executed.
        . If one is not executed (for ex because the server goes down, the other one is not executed also)
        . To use 'transaction' => we have to convert a 'standalone Mongo server' into a 'replica set'
          and this implicate security issues!!!
        . If we use 'Mongo DB Atlas' we do not need to make any configurations

        . 'ACID' Transactions: 'Atomicity', 'Consistency', 'Isolation', 'Durability'
*/
