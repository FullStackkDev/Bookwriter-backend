import Book from "../models/bookSchema.js";
import { fetchBook, create, update } from "../services/bookServices.js";
import { STATUS_CODE } from "../utils/constants.js";

const getBook = async (req, res) => {
  const result = await fetchBook();
  return res.status(STATUS_CODE).json(result);
};

const createBook = async (req, res) => {
  const result = await create(req.body);
  return res.status(STATUS_CODE).json(result);
};

const updateBook = async (req, res) => {
  const result = await update(req.params.id, req.body);
  return res.status(STATUS_CODE).json(result);
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
