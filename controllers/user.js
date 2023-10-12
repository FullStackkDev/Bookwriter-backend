// user authentication controller
import User from "../models/userSchema.js";
import { update, create } from "./helper/userHelper.js";
import {
  getUserValidationErrors,
  emailRegex,
  passwordRegex,
} from "../utils.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
      return res.status(200).json({
        message: "Invalid email address.",
        success: false,
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(200).json({
        message: "Password must be at least 8 characters long.",
        success: false,
      });
    }

    //check if user already exist based on email
    const user = await GetUser("email", email);

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(200).json({
        message: "Email or password is incorrect",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User Signin Sucessfully",
      success: true,
      payload: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        token: user.generateToken(),
      },
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
};

const createUser = async (req, res) => {
  const result = await create(req.body);
  res.status(result.status).json(result.payload);
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await GetUser("_id", userId);
    user.password = undefined;
    if (!user) {
      return res.status(200).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Fetched Successfully",
      payload: user,
      success: true,
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
};

const updateUser = async (req, res) => {
  const result = await update(req.params.id, req.body);
  res.status(result.status).json(result.payload);
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
      return res.status(200).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Deleted Successfully",
      payload: deletedUser,
      success: true,
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
};

const GetUser = async (fieldName, value) => {
  const query = {};
  query[fieldName] = value;
  return await User.findOne(query);
};

export default {
  login,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
