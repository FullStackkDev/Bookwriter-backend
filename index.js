// index file
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/config.js";
import bookRouter from "./routes/book.js";
import userRouter from "./routes/user.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json({ limit: "2mb" }));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Nodejs api connected successfully!!!"));
app.use(userRouter);
app.use(bookRouter);
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
