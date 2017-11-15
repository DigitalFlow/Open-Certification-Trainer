import * as exjwt from "express-jwt";
import * as jwt from "jsonwebtoken";

let jwtMw = exjwt({
  secret: process.env.JWT_SECRET
})
