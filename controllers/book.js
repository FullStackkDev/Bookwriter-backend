import Book from "../models/bookSchema.js";

const getBook = async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json({
      message: "Book Fetched Successfully",
      payload: books,
      success: true,
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !image || !description) {
      return res.status(200).json({
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
    res.status(200).json({ message: error.message, success: false });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description } = req.body;
    if (!title || !image || !description) {
      return res.status(200).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res.status(200).json({
        message: "Book Not Found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Book Updated Successfully",
      payload: updatedBook,
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      message: error.message,
      success: false,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(200).json({
        message: "Book Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Book Deleted Successfully",
      payload: deletedBook,
      success: true,
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
};

export default {
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
