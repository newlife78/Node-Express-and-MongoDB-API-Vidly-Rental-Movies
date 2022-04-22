/*
    . Tests created using TDD Technique ('Test Driven Development').
    . Using TDD we first create the test and only AFTER we create the development / production code.
    . TDD starts by defining the cases that the test must cover and only AFTER it starts the development process. 

    . For 'retunrs' movies modules we need:
        . To POST a requet in a new end point: 'POST /api/returns {customrId, movieId}'
        . Set the cases that need testing:
            .  Return 401 if client is not logged in
            .  Return 400 if customerId is not provided
            .  Return 400 if movieId is not provided
            .  Return 404 if no rental found for this customer/movie
            .  Return 400 if rental is already processed
            .  Return 200 if valid request
            .  Set the return date
            .  Calculate the rental fee
            .  Increase the stock
            .  Return rental
*/

const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../server");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345", // need to be at least 5 characters long
      dailyRentalRate: 2, // same value has 'dailyRentalRate' from 'rental' object
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345", // need to be at least 5 characters long
        phone: "12345", // need to be at least 5 characters long
        // 'isGold' property is not necessary => bacause it has a default value
      },
      movie: {
        _id: movieId,
        title: "12345", // need to be at least 5 characters long
        dailyRentalRate: 2, // same value has 'dailyRentalRate' from 'movie' object
      },
    });
    await rental.save();
  });

  // Shutting down the server:
  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});

    await server.close();
  });

  // Return 401 if client is not logged in
  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  // Return 400 if customerId is not provided
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 400 if movieId is not provided
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 404 if no rental found for this customer/movie
  it("should return 404 if no rental found for the customer/movie", async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  // Return 400 if return is already processed
  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 200 if valid request
  it("should return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  // Set the return date if input is valid
  it("should set the returnDate if input is valid", async () => {
    const res = await exec();

    // Get the 'rental' document from the DB and inspect the date property:
    const rentalInDb = await Rental.findById(rental._id);
    /* . Returns the diff in miliseconds.
       . Diff between the time from load the time in the DB and read it from our test.
       . For that we create a gap of 10s (can be more or less. We decide!)   
    */
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  /*  . Set the return rentalFee if input is valid
      
      . NOTES:
          . 'dateOut' is set by mongoose has the current date by default. To change this we use 'moment' package.
          . We need to modify this 'dateOut' before calling 'const res = await exec();' 
          . 'moment': npm package to work with dates and times.
  */
  it("should set the retalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    // '14': 7 days * 2 USD/day = 14 USD:
    expect(rentalInDb.rentalFee).toBe(14);
  });

  // Increase the movie stock if input is valid
  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movie._id);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  // Return rental if input is valid
  it("should return the rental if input is valid", async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
