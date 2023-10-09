// user authentication controller
import User from "../models/userSchema.js";

const getUser = async (req, res) => {
  res.send("get user");
};

const createUser = async (req, res) => {
  res.send("cretae user");
};

const updateUser = async (req, res) => {
  res.send("update user");
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

export default {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
