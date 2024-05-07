import express, { request, response } from "express";
import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";

const server = express();
const PORT = process.env.PORT;

/**
 * @param {request} req
 * @param {response} res
 */
server.get("/", (req, res) => {
  res.send("hello world");
});

// Place routes above this middleware
server.use(ErrorMiddleware);

server.listen(PORT, () => {
  console.info(`Server is running on PORT ${PORT}`);
});
