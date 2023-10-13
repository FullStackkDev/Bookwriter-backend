import User from "../../models/userSchema.js";
import {
  getUserValidationErrors,
  emailRegex,
  passwordRegex,
} from "../../utils.js";

export const create = async (userData) => {
  try {
    //For third party user registering
    if ("third_party_user_id" in userData || "third_party_type" in userData) {
      if (typeof userData.third_party_user_id !== "number") {
        return {
          status: 200,
          payload: {
            message: "ID must be a number",
            success: false,
          },
        };
      }

      if (!userData.third_party_type) {
        return {
          status: 200,
          payload: {
            message: "Third party type is missing",
            success: false,
          },
        };
      }

      //check if user already exist based on third_party_user_id
      const userExist = await GetUser(
        "third_party_user_id",
        userData.third_party_user_id
      );
      if (userExist) {
        return {
          status: 200,
          payload: {
            message: "User Already Exist",
            payload: {
              _id: userExist._id,
              first_name: userExist.first_name,
              last_name: userExist.last_name,
              email: userExist.email,
              third_party_user_id: userExist.third_party_user_id,
              third_party_type: userExist.third_party_type,
              token: userExist.generateToken(),
            },
            success: true,
          },
        };
      }
      const user = await AddUser(userData);

      return {
        status: 200,
        payload: {
          message: "User Signin Successfully",
          payload: { ...user._doc, token: user.generateToken() },
          success: true,
        },
      };
    }

    //For simple user registering
    //check if user already exist based on email
    const userExist = await GetUser("email", userData.email);
    if (userExist) {
      return {
        status: 200,
        payload: {
          message: "User Already Exist",
          success: false,
        },
      };
    }
    let user = await AddUser(userData);
    user.password = undefined;

    return {
      status: 200,
      payload: {
        message: "User Registered Successfully",
        payload: user,
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

export const remove = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
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
        message: "User Deleted Successfully",
        payload: deletedUser,
        success: true,
      },
    };
  } catch (error) {
    return {
      status: 200,
      payload: {
        message: error.message,
        success: false,
      },
    };
  }
};

export const fetchUser = async (userId) => {
  try {
    let user = await GetUser("_id", userId);
    user.password = undefined;
    if (!user) {
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
        message: "User Fetched Successfully",
        payload: user,
        success: true,
      },
    };
  } catch (error) {
    return {
      status: 200,
      payload: {
        message: error.message,
        success: false,
      },
    };
  }
};

export const loginUser = async (userData) => {
  try {
    if (!emailRegex.test(userData.email)) {
      return {
        status: 200,
        payload: {
          message: "Invalid email address.",
          success: false,
        },
      };
    }
    if (!passwordRegex.test(userData.password)) {
      return {
        status: 200,
        payload: {
          message: "Password must be at least 8 characters long.",
          success: false,
        },
      };
    }

    //check if user already exist based on email
    const user = await GetUser("email", userData.email);
    if (!user) {
      return {
        status: 200,
        payload: {
          message: "User not found",
          success: false,
        },
      };
    }

    if (!(await user.matchPassword(userData.password))) {
      return {
        status: 200,
        payload: {
          message: "Email or password is incorrect",
          success: false,
        },
      };
    }
    user.password = undefined;

    return {
      status: 200,
      payload: {
        message: "User Signin Sucessfully",
        payload: {
          ...user._doc,
          token: user.generateToken(),
        },
        success: true,
      },
    };
  } catch (error) {
    return {
      status: 200,
      payload: {
        message: error.message,
        success: false,
      },
    };
  }
};

const GetUser = async (fieldName, value) => {
  const query = {};
  query[fieldName] = value;
  return await User.findOne(query);
};

const UpdateUser = async (id, updatedData) => {
  return await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const AddUser = async (userData) => {
  return await User.create(userData);
};
