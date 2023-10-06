import Book from "../models/bookSchema.js";

const getBook = async (req, res) => {
  res.send("get book route");
};
const createBook = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !image || !description) {
      return res.status(404).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    const book = await Book.create({ title, image, description });
    return res.status(201).json({
      message: "Book Created Successfully",
      payload: book,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};
const updateBook = async (req, res) => {
  res.send("update book route");
};
const deleteBook = async (req, res) => {
  res.send("delete book route");
};

export default {
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
