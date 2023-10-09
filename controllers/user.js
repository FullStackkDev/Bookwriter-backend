// user authentication controller
import User from "../models/userSchema.js";

const getUser = async (req, res) => {
  res.send("get user");
};

const createUser = async (req, res) => {
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
      message: "User Created Successfully",
      payload: user,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
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
