import User from "../../models/userSchema.js";
import { getUserValidationErrors } from "../../utils.js";

export const update = async (id, updatedData) => {
  try {
    if (
      "current_password" in updatedData ||
      "updated_password" in updatedData
    ) {
      const user = await User.findById(id);
      if (!user) {
        return {
          status: 200,
          payload: {
            message: "User Not Found",
            success: false,
          },
        };
      }
      if (!(await user.matchPassword(updatedData.current_password))) {
        return {
          status: 200,
          payload: {
            message: `Your current password is wrong.`,
            success: false,
          },
        };
      }
      user.password = updatedData.updated_password;
      await user.save();
      return {
        status: 200,
        payload: {
          message: "User Password Updated Successfully",
          success: true,
        },
      };
    }

    const updatedUser = await UpdateUser(id, updatedData);
    if (!updatedUser) {
      return {
        status: 200,
        payload: {
          message: "User Not Found",
          success: false,
        },
      };
    }
    return {
      status: 200,
      payload: {
        message: "User Updated Successfully",
        payload: updatedUser,
        success: true,
      },
    };
  } catch (error) {
    let ValidationErrors = {};
    if (error.name === "ValidationError" && Object.keys(error.errors).length) {
      ValidationErrors = getUserValidationErrors(error);
    }
    return {
      status: 200,
      payload: {
        message: {
          error: Object.keys(ValidationErrors).length
            ? ValidationErrors
            : error.message,
        },
        success: false,
      },
    };
  }
};

const UpdateUser = async (id, updatedData) => {
  return await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");
};
