import User from "../models/userSchema.js";
import { getUserValidationErrors } from "../utils/utils.js";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/constants.js";
import {
  EXIST,
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  INVALID_EMAIL_ADDRESS,
  PASSWORD_8_CHAR_LONG,
  NOT_FOUND,
} from "../utils/messages.js";

export const create = async (userData) => {
  try {
    let payload = {};
    if ("third_party_user_id" in userData || "third_party_type" in userData) {
      //For thir party user registering
      payload = await createThirdpartyUser(userData);
    } else {
      //For simple user registering
      payload = await createSimpleUser(userData);
    }
    return payload;
  } catch (error) {
    let validationErrors = {};
    if (error.name === "ValidationError" && Object.keys(error.errors).length) {
      validationErrors = getUserValidationErrors(error);
    } else if (error.code === 11000) {
      validationErrors = getUserValidationErrors(error);
    }
    return {
      message: {
        error: Object.keys(validationErrors).length
          ? validationErrors
          : error.message,
      },
      success: false,
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
    let payload = {};
    if (!EMAIL_REGEX.test(userData.email)) {
      payload = {
        message: `${INVALID_EMAIL_ADDRESS}`,
        success: false,
      };
    } else if (!PASSWORD_REGEX.test(userData.password)) {
      payload = {
        message: `${PASSWORD_8_CHAR_LONG}`,
        success: false,
      };
    } else {
      //check if user already exist based on email
      const user = await GetUser("email", userData.email);
      if (!user) {
        payload = {
          message: `User ${NOT_FOUND}`,
          success: false,
        };
      } else if (!(await user.matchPassword(userData.password))) {
        payload = {
          message: "Email or password is incorrect",
          success: false,
        };
      } else {
        user.password = undefined;
        payload = {
          message: `${LOGIN_SUCCESS}`,
          payload: {
            ...user._doc,
            token: user.generateToken(),
          },
          success: true,
        };
      }
    }
    return payload;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

const createThirdpartyUser = async (userData) => {
  let payload = {};

  if (typeof userData.third_party_user_id !== "number") {
    payload = {
      message: "User ID must be a number",
      success: false,
    };
  } else if (!userData.third_party_type) {
    payload = {
      message: "Third party type is missing",
      success: false,
    };
  } else {
    const user = await GetUser(
      "third_party_user_id",
      userData.third_party_user_id
    );

    if (user) {
      payload = {
        message: `User ${EXIST}`,
        payload: {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          third_party_user_id: user.third_party_user_id,
          third_party_type: user.third_party_type,
          token: user.generateToken(),
        },
        success: true,
      };
    } else {
      const user = await AddUser(userData);
      payload = {
        message: `${LOGIN_SUCCESS}`,
        payload: { ...user._doc, token: user.generateToken() },
        success: true,
      };
    }
  }

  return payload;
};

const createSimpleUser = async (userData) => {
  let payload = {};

  const user = await GetUser("email", userData.email);
  if (user) {
    payload = {
      message: `User ${EXIST}`,
      success: false,
    };
  } else {
    let user = await AddUser(userData);
    user.password = undefined;
    payload = {
      message: `${SIGNUP_SUCCESS}`,
      payload: user,
      success: true,
    };
  }

  return payload;
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
