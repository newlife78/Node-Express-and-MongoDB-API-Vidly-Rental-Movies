/*
    . Module responsible for testing all the execution path of this middleware function:
*/

const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
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

  let token;

  const exec = () => {
    // chose any end point that we want. In this case '/api/genres':
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  // First test case: there is no token
  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  // Second test case: invalid token
  it("should return 400 if token is invalid", async () => {
    token = "a"; // simple string to test invalid token

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Third test case: 'happy path' <=> valid token
  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
