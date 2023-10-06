// index file
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/config.js";

const app = express();
dotenv.config();
connectDB();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Nodejs api connected successfully!!!"));

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
