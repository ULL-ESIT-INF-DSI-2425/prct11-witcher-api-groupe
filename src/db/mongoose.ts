// In this page we will create a server using express and connect to the database using mongoose
import { connect } from "mongoose";

const mongoURL = process.env.MONGODB_URL;

if (!mongoURL) {
  throw new Error("MONGODB_URL environment variable not set");
}

connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Unable to connect to MongoDB server:", err);
  });