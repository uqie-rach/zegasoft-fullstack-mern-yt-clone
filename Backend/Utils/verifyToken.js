import { request, response } from "express";
import { ResponseError } from "../Config/error.js";
import jwt from "jsonwebtoken";

/**
 *
 * @param {request} req
 * @param {response} res
 */
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new ResponseError("Access denied", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) throw new ResponseError("Invalid token", 403);

    req.user = user;
    next();
  });
};

export default verifyToken;
