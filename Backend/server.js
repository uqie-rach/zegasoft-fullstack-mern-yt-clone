import express, { request, response } from "express";

import { ErrorMiddleware } from "./Middlewares/ErrorMiddleware.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./Config/database.js";
import { UserRouter } from "./Routes/userRoute.js";
import { AuthRouter } from "./Routes/authRoute.js";
import { VideoRouter } from "./Routes/videoRoute.js";

const server = express();
const PORT = process.env.PORT;
dotenv.config();

// Middlewares
server.use(cookieParser());
server.use(express.json());

/**
 * @param {request} req
 * @param {response} res
 */
server.get("/", async (req, res, next) => {
  try {
    res.json({ message: "Hello world" });
  } catch (err) {
    next(err);
  }
});

// Routes
server.use("/api/auth", AuthRouter);
server.use("/api/users", UserRouter);
server.use("/api/videos", VideoRouter);

// Place routes above this middleware
// Error handler
server.use(ErrorMiddleware);

server.listen(PORT, () => {
  // Uncomment if you wanna establish a connection to db
  connectToDb();

  console.info(`Server is running on PORT ${PORT}`);
});
