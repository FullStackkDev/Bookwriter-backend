import User from "../../models/userSchema.js";
import { getUserValidationErrors } from "../../utils.js";

export const update = async (id, updatedData, res) => {
  try {
    if (
      "current_password" in updatedData ||
      "updated_password" in updatedData
    ) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(200).json({
          message: "User Not Found",
          success: false,
        });
      }
      if (!(await user.matchPassword(updatedData.current_password))) {
        return res.status(200).json({
          message: `Your current password is wrong.`,
          success: false,
        });
      }
      user.password = updatedData.updated_password;
      await user.save();
      return res.status(200).json({
        message: "User Password Updated Successfully",
        success: true,
      });
    }

    const updatedUser = await UpdateUser(id, updatedData);
    if (!updatedUser) {
      return res.status(200).json({
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

const UpdateUser = async (id, updatedData) => {
  return await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");
};
