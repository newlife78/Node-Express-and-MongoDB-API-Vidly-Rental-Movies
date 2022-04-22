/*  . Types of errors:
        . Return 400 if customerId is not provided ( test cover by: 'validate(validateReturn)' )
        . Return 400 if customerId is not provided ( test cover by: 'validate(validateReturn)' )
        . Return 404 if no rental found for this customer/movie
        . Return 400 if return is already processed
        . Set the return date if input is valid ( test cover by: 'rental.return()' => see 'models' -> 'rental.js' )
        . Set the return rentalFee if input is valid ( test cover by: 'rental.return()' => see 'models' -> 'rental.js' )
        . Return 200 if valid request
        . Return rental if input is valid

    . Terminology:
        . In OOP we have 2 types of methods:
            .  Static methods:
                . 'Rental.lookup' => in this case '.lookup' is the method.
                . Available directly on a class.
                . Used when we are not working with a particular object. That is way they are available
                  on a class.

            . Instance methods:
                . 'new User().generateAuthToken()' => in this case '.generateAuthToken()' is the method.
                . Available on an object or an instance of a class.
                . Used when we are working with a particular object and the result we will get will be
                  dependent on that object.
*/

const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");

  // At this stage if we pass the test 'if (!rental)' => we have a rental object => it is suficient to see if 'rental.dateReturned' is set
  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();
  await rental.save();

  // Increase the movie stock if input is valid
  // We could use the queryFrist or updateFirst approachs. In this case we use the updateFirst.
  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  // There is no need to use 'status(200)' in 'return res.status(200).send(rental)', because EXPRESS will set that by default.
  return res.send(rental);
});

// Function that validate return:
function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
