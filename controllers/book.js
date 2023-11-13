import { fetchBook, create, update, remove } from "../services/bookServices.js";
import { STATUS_CODE } from "../utils/constants.js";

const getBook = async (req, res) => {
  const result = await fetchBook();
  return res.status(STATUS_CODE).json(result);
};

const createBook = async (req, res) => {
  const result = await create(req.body, req?.user?._id);
  return res.status(STATUS_CODE).json(result);
};

const updateBook = async (req, res) => {
  const result = await update(req.params.id, req.body);
  return res.status(STATUS_CODE).json(result);
};

const deleteBook = async (req, res) => {
  const result = await remove(req.params.id);
  return res.status(STATUS_CODE).json(result);
};

export default {
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
