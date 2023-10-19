// user model
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { NAME_REGEX, PHONE_REGEX } from "../utils/constants.js";

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [3, "First name must have at least 3 characters"],
      validate: {
        validator: (value) => {
          return NAME_REGEX.test(value);
        },
        message: "First name does not start with a number",
      },
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [3, "Last name must have at least 3 characters"],
      validate: {
        validator: (value) => {
          return NAME_REGEX.test(value);
        },
        message: "Last name does not include numbers",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already present"],
      trim: true,
      lowercase: true, // Convert email to lowercase
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    phone_no: {
      type: String,
      validate: {
        validator: (value) => {
          return PHONE_REGEX.test(value);
        },
        message:
          "Invalid phone number format. Please use the format: +xx-xxxxxxxxxx",
      },
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters long"],
    },
    third_party_user_id: {
      type: Number,
    },
    third_party_type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// WE ARE HASHING THE PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

const user = mongoose.model("user", userSchema);

export default user;
