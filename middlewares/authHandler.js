// validate for route protection
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { STATUS_CODE } from "../utils/constants.js";
import { NOT_FOUND } from "../utils/messages.js";

const Protected = async (req, res, next) => {
  console.log("Enter in authentication file");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let { id } = jwt.decode(token, process.env.JWT_SECRET);
      let user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(STATUS_CODE).json({
          message: `Token Invalid/User ${NOT_FOUND}`,
          success: false,
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(STATUS_CODE).json({
        message: error.message,
        success: false,
      });
    }
  } else {
    return res.status(STATUS_CODE).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export default Protected;
