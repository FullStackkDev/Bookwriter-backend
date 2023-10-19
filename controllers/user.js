import {
  update,
  create,
  remove,
  fetchUser,
  loginUser,
} from "../services/userServices.js";
import { STATUS_CODE } from "../utils/constants.js";

const login = async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(STATUS_CODE).json(result);
};

const createUser = async (req, res) => {
  const result = await create(req.body);
  return res.status(STATUS_CODE).json(result);
};

const getUser = async (req, res) => {
  const result = await fetchUser(req.user._id);
  return res.status(STATUS_CODE).json(result);
};

const updateUser = async (req, res) => {
  const result = await update(req.params.id, req.body);
  return res.status(STATUS_CODE).json(result);
};

const deleteUser = async (req, res) => {
  const result = await remove(req.params.id);
  return res.status(STATUS_CODE).json(result);
};

export default {
  login,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
