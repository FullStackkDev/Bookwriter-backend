import Book from "../models/bookSchema.js";
import { getBookValidationErrors } from "../utils/utils.js";
import { createWriter, removeWritersByBookId } from "./writerRoleServices.js";
import {
  FETCHED,
  CREATED,
  UPDATED,
  NOT_FOUND,
  DELETED,
} from "../utils/messages.js";

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

export const create = async (bookData, userId) => {
  try {
    let payload = {};
    const book = await Book.create(bookData);

    const writerPayloadData = {
      book_id: book._id,
      user_id: userId,
      role: "author",
    };

    const writerRole = await createWriter(writerPayloadData);

    payload = {
      bookPayload: {
        message: `Book ${CREATED}`,
        payload: book,
        success: true,
      },
      writerRolePayload: writerRole,
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

export const remove = async (id) => {
  try {
    let payload = {};

    const deletedBook = await Book.findByIdAndDelete(id);
    const deleteWriterRole = await removeWritersByBookId(id);

    if (!deletedBook && !deleteWriterRole.success) {
      payload = {
        bookPayload: {
          message: `Book ${NOT_FOUND}`,
          success: false,
        },
        writerRolePayload: deleteWriterRole,
      };
    } else {
      payload = {
        bookPayload: {
          message: `Book ${DELETED}`,
          payload: deletedBook,
          success: true,
        },
        writerRolePayload: deleteWriterRole,
      };
    }

    return payload;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};
