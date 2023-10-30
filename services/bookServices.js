import Book from "../models/bookSchema.js";
import { FETCHED } from "../utils/messages.js";

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
