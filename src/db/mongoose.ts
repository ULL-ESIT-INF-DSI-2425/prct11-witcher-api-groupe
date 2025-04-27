// In this page we will create a server using express and connect to the database using mongoose
import { connect } from "mongoose";

connect("mongodb://localhost:27017/witcher-api").then(() => {
  console.log("Connected to database");
}).catch(err => {
  console.error("Unable to connect to MongoDB server:", err);
});