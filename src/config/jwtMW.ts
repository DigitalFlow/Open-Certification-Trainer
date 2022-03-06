import exjwt from "express-jwt";

const jwtMw = exjwt({
  secret: process.env.JWT_SECRET
});
