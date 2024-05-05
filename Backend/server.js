import express, { request, response } from "express";

const server = express();
const PORT = process.env.PORT;


/**
 * @param {request} req
 * @param {response} res
 */
server.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(PORT, () => {
  console.info(`Server is running on PORT ${PORT}`);
});
