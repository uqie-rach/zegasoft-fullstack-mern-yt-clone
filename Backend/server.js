import express, { request, response } from "express";

import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./Config/database.js";

const server = express();
const PORT = process.env.PORT;
dotenv.config();

// Uncomment if you wanna establish a connection to db
// connectToDb();

// Middlewares
server.use(cookieParser());
server.use(express.json());

/**
 * @param {request} req
 * @param {response} res
*/
server.get("/", async (req, res, next) => {
  try {
    res.json({ message: "Hello world"})
  } catch (err) {
    next(err);
  }
});

// Routes

// Place routes above this middleware
// Error handler
server.use(ErrorMiddleware);

server.listen(PORT, () => {
  console.info(`Server is running on PORT ${PORT}`);
});
