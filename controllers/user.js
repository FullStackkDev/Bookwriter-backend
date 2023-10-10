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
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (!(await user.matchPassword(password))) {
      return res.status(404).json({
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
    res.status(404).json({ message: error.message, success: false });
  }
};

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_no, password } = req.body;

    if (!first_name || !last_name || !email || !phone_no || !password) {
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

    let user = await User.create({
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
    res.status(404).json({ message: error.message, success: false });
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

    if (
      !first_name ||
      !last_name ||
      !email ||
      !third_party_user_id ||
      !third_party_type
    ) {
      return res.status(404).json({
        message: "Required Data is missing",
        success: false,
      });
    }

    //check if user already exist based on third_party_user_id
    const isUserExist = await User.findOne({ third_party_user_id });
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
          token: isUserExist.generateToken(),
        },
      });
    }

    const user = await User.create({
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
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone_no } = req.body;
    if (!first_name || !last_name || !email || !phone_no) {
      return res.status(404).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    if (req.body.password) {
      return res.status(404).json({
        message: "This route is not for password update.",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        email,
        phone_no,
      },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    return res.status(201).json({
      message: "User Updated Successfully",
      payload: updatedUser,
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};

const updateThirdPartyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(404).json({
        message: "Required Fields are missing",
        success: false,
      });
    }

    const updatedThirdPartyUser = await User.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
      },
      { new: true }
    );
    if (!updatedThirdPartyUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User Updated Successfully",
      payload: updatedThirdPartyUser,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { updated_password, current_password } = req.body;
    if (!updated_password || !current_password) {
      return res.status(404).json({
        message: "Please Fill all Fields",
        success: false,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    if (!(await user.matchPassword(current_password))) {
      return res.status(404).json({
        message: `Your current password is wrong.`,
        success: false,
      });
    }

    user.password = updated_password;
    await user.save();

    res.json({
      message: "User Password Updated Successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
      return res.status(404).json({
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
    res.status(404).json({ message: error.message, success: false });
  }
};

export default {
  login,
  registerUser,
  thirdPartyUserLogin,
  getUser,
  updateUser,
  updateThirdPartyUser,
  updateUserPassword,
  deleteUser,
};
