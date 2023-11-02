import Book from "../models/bookSchema.js";
import { getBookValidationErrors } from "../utils/utils.js";
import { FETCHED, CREATED, UPDATED, NOT_FOUND } from "../utils/messages.js";

export const fetchBook = async () => {
  try {
    let payload = {};
    const books = await Book.find();

    payload = {
      message: `Book ${FETCHED}`,
      payload: books,
      success: true,
    };

    return payload;
  } catch (error) {
    return { message: error.message, success: false };
  }
};

export const create = async (bookData) => {
  try {
    let payload = {};
    const book = await Book.create(bookData);

    payload = {
      message: `Book ${CREATED}`,
      payload: book,
      success: true,
    };

    return payload;
  } catch (error) {
    let validationErrors = getBookValidationErrors(error);
    return {
      message: {
        error: Object.keys(validationErrors).length
          ? validationErrors
          : error.message,
      },
      success: false,
    };
  }
};

export const update = async (id, updatedData) => {
  try {
    let payload = {};

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      payload = {
        message: `Book ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `Book ${UPDATED}`,
        payload: updatedBook,
        success: true,
      };
    }

    return payload;
  } catch (error) {
    let validationErrors = getBookValidationErrors(error);
    return {
      message: {
        error: Object.keys(validationErrors).length
          ? validationErrors
          : error.message,
      },
      success: false,
    };
  }
};
