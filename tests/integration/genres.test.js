const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("/api/genres", () => {
  let server;

  //Starting the server:
  beforeEach(() => {
    server = require("../../server");
  });

  // Shutting down the server:
  afterEach(async () => {
    await Genre.deleteMany({});

    await server.close();
  });

  /* Testing 'GET' method for '/api/genres': */
  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];

      await Genre.collection.insertMany(genres);

      // Request: 'GET', 'POST', 'PUT', 'DELETE' to a given endpoint ('/api/genres')
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  // Testing 'GET' method for '/api/genres/:id':
  describe("GET /:id", () => {
    // valid id test:
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    // invalid id test:
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    // pass a valid object id, but does not exists genre with that id:
    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  // Testing 'POST' method for '/api/genres/':
  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();

      // Values for the 'happy path':
      name = "genre1";
    });

    /* . Testing 'auth' middleware function.
       . We are assuming that the Client can NOT logged in.
    */
    it("should return 401 if client is not logged in.", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    /* . Testing 'POST' assuming that:
          . Client is looged in.
          . Client is sending an INVALID genre (LESS THAN 5 CHARACTERS).

       . To implement this test:
          . Client must be logged in => generate an authentication token and then includ it on the header.
    */
    it("should return 400 if genre less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    /* . Testing 'POST' assuming that:
          . Client is looged in.
          . Client is sending an INVALID genre (LESS THAN 5 CHARACTERS).

       . To implement this test:
          . Client must be logged in => generate an authentication token and then includ it on the header.
    */
    it("should return 400 if genre greater than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // Test the 'happy path':
    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    // Test if the genre is in the body of the response:
    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  /* Testing 'PUT' method for '/api/genres/:id': */
  describe("PUT /:id", () => {
    let genre;
    let token;
    let id;
    let newName;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      newName = "updatedName";
    });

    // Client is not logged in:
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    // Client sent a genre with less than 5 characters (bad request):
    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // Client sent a genre with more than 50 characters (bad request):
    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // Client sent an invalid id:
    it("should return 404 if genre with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    // Client sent a valid id and sent an update:
    it("should update the gender if nput is valid", async () => {
      await exec();

      const updateGenre = await Genre.findById(genre._id);

      expect(updateGenre.name).toBe(newName);
    });

    // Response from the server with the updated genre:
    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  // Testing 'DELETE' method for '/api/genres/:id'
  describe("DELETE /:id", () => {
    let genre;
    let id;
    let token;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    // Client is not logged in:
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    // User is not an Admin:
    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    // Invalid id:
    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    // Genre with the given id does NOT exist:
    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    // Delete the genre if input is valid:
    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    // Return the removed genre:
    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
