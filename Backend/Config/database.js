import mongoose from "mongoose";

export const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.info("Connected to database");
    })
    .catch((err) => console.error(err));
};
