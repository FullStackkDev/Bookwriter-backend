// user authentication controller
import User from "../models/userSchema.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      res.status(404);
      return res.json({
        message: "User not found",
        success: false,
      });
    }
    if (!(await user.matchPassword(password))) {
      res.status(404);
      return res.json({
        message: "Email or password is incorrect",
        success: false,
      });
    }

    res.json({
      message: "User Signin Sucessfully",
      success: true,
      payload: {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        token: user.generateToken(),
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(404).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    //check if user already exist based on email
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(404).json({
        message: "User Already Exist",
        success: false,
      });
    }

    const user = await User.create({ first_name, last_name, email, password });

    return res.status(201).json({
      message: "User Registered Successfully",
      payload: user,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({
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
    res.status(404).json({ message: error.message, success: false });
  }
  res.send("get specific user");
};

const updateUser = async (req, res) => {
  res.send("update user");
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

export default {
  login,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
};
