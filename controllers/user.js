import {
  update,
  create,
  remove,
  fetchUser,
  loginUser,
} from "./helper/userHelper.js";

const login = async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(result.status).json(result.payload);
};

const createUser = async (req, res) => {
  const result = await create(req.body);
  return res.status(result.status).json(result.payload);
};

const getUser = async (req, res) => {
  const result = await fetchUser(req.user._id);
  return res.status(result.status).json(result.payload);
};

const updateUser = async (req, res) => {
  const result = await update(req.params.id, req.body);
  return res.status(result.status).json(result.payload);
};

const deleteUser = async (req, res) => {
  const result = await remove(req.params.id);
  return res.status(result.status).json(result.payload);
};

export default {
  login,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
