import express from "express";
import book from "../controllers/book.js";

const router = express.Router();

router.get("/book", book.getBook);
router.post("/book", book.createBook);
router.put("/book/:id", book.updateBook);
router.delete("/book/:id", book.deleteBook);

export default router;
