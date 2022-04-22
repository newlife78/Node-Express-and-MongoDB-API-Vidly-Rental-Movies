/*
    If client send a valid json web token (JWT) =>
    'req.user' will be populated with the payload of the JWT (in this case 'decoded)
*/

const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  it("should populate 'req.user' with the payload of a valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {}; // we are not working with the response, but we need to pass it to 'auth' function
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
