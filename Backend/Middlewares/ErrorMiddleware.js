import { request, response } from "express";
import { ResponseError } from "../Config/error.js";
/**
 *
 * @param {Error} err
 * @param {response} res
 * @param {request} req
 * @param {NextFunction} next
 */

export const ErrorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
