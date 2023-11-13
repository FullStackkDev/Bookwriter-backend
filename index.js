// index file
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/config.js";
import bookRouter from "./routes/book.js";
import userRouter from "./routes/user.js";
import writerRoleRouter from "./routes/writerRole.js";
import sectionRouter from "./routes/section.js";
import publicRouter from "./routes/public.js";
import Protected from "./middlewares/authHandler.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json({ limit: "2mb" }));
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Nodejs api connected successfully!!!"));
app.use(publicRouter);

app.use(Protected);
app.use(userRouter);
app.use(bookRouter);
app.use(writerRoleRouter);
app.use(sectionRouter);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
