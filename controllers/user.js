// user authentication controller
import User from "../models/userSchema.js";
import { update } from "./helper/userHelper.js";
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

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_no, password } = req.body;

    //check if user already exist based on email
    const UserExist = await GetUser("email", email);
    if (UserExist) {
      return res.status(200).json({
        message: "User Already Exist",
        success: false,
      });
    }
    let user = await AddUser({
      first_name,
      last_name,
      email,
      phone_no,
      password,
    });
    user.password = undefined;

    return res.status(201).json({
      message: "User Registered Successfully",
      payload: user,
      success: true,
    });
  } catch (error) {
    let ValidationErrors = {};
    if (error.name === "ValidationError" && Object.keys(error.errors).length) {
      ValidationErrors = getUserValidationErrors(error);
    }

    res.status(200).json({
      message: {
        error: Object.keys(ValidationErrors).length
          ? ValidationErrors
          : error.message,
      },
      success: false,
    });
  }
};

const thirdPartyUserLogin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      third_party_user_id,
      third_party_type,
    } = req.body;

    if (typeof third_party_user_id !== "number") {
      return res.status(200).json({
        message: "ID must be a number",
        success: false,
      });
    }

    if (!third_party_type) {
      return res.status(200).json({
        message: "Third party type is missing",
        success: false,
      });
    }

    //check if user already exist based on third_party_user_id
    const isUserExist = await GetUser(
      "third_party_user_id",
      third_party_user_id
    );
    if (isUserExist) {
      return res.status(200).json({
        message: "User Already Exist",
        success: true,
        payload: {
          _id: isUserExist._id,
          first_name: isUserExist.first_name,
          last_name: isUserExist.last_name,
          email: isUserExist.email,
          third_party_user_id,
          third_party_type,
          token: isUserExist.generateToken(),
        },
      });
    }

    const user = await AddUser({
      first_name,
      last_name,
      email,
      third_party_user_id,
      third_party_type,
    });
    return res.status(201).json({
      message: "User Signin Successfully",
      payload: { ...user._doc, token: user.generateToken() },
      success: true,
    });
  } catch (error) {
    let ValidationErrors = {};
    if (error.name === "ValidationError" && Object.keys(error.errors).length) {
      ValidationErrors = getUserValidationErrors(error);
    }
    res.status(200).json({
      message: {
        error: Object.keys(ValidationErrors).length
          ? ValidationErrors
          : error.message,
      },
      success: false,
    });
  }
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

const AddUser = async (userData) => {
  return await User.create(userData);
};

export default {
  login,
  registerUser,
  thirdPartyUserLogin,
  getUser,
  updateUser,
  deleteUser,
};
