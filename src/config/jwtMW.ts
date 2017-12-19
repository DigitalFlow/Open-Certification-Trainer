import * as exjwt from "express-jwt";
import * as jwt from "jsonwebtoken";

const jwtMw = exjwt({
  secret: process.env.JWT_SECRET
});
