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
  FETCHED,
  DELETED,
  UPDATED,
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
    let validationErrors = getUserValidationErrors(error);

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
    let payload = {};
    if (
      "current_password" in updatedData ||
      "updated_password" in updatedData
    ) {
      payload = await updatePassword(id, updatedData);
    } else {
      payload = await updateUser(id, updatedData);
    }

    return payload;
  } catch (error) {
    let validationErrors = getUserValidationErrors(error);

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

export const remove = async (id) => {
  try {
    let payload = {};
    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
      payload = {
        message: `User ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `User ${DELETED}`,
        payload: deletedUser,
        success: true,
      };
    }

    return payload;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const fetchUser = async (userId) => {
  try {
    let payload = {};
    let user = await GetUser("_id", userId);
    user.password = undefined;
    if (!user) {
      payload = {
        message: `User ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `User ${FETCHED}`,
        payload: user,
        success: true,
      };
    }

    return payload;
  } catch (error) {
    return {
      message: error.message,
      success: false,
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

  if (!userData.third_party_user_id) {
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

const updatePassword = async (id, updatedData) => {
  let payload = {};
  const user = await User.findById(id);
  if (!user) {
    payload = {
      message: `User ${NOT_FOUND}`,
      success: false,
    };
  } else if (!(await user.matchPassword(updatedData.current_password))) {
    payload = {
      message: `Your current password is wrong.`,
      success: false,
    };
  } else {
    user.password = updatedData.updated_password;
    await user.save();
    payload = {
      message: `User Password ${UPDATED}`,
      success: true,
    };
  }

  return payload;
};

const updateUser = async (id, updatedData) => {
  let payload = {};
  const updatedUser = await UpdateUser(id, updatedData);
  if (!updatedUser) {
    payload = {
      message: `User ${NOT_FOUND}`,
      success: false,
    };
  } else {
    payload = {
      message: `User ${UPDATED}`,
      payload: updatedUser,
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
