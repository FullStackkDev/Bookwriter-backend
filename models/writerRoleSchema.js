import mongoose from "mongoose";

const writerRoleSchema = mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: [true, "book_id is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user_id is required"],
    },
    role: {
      type: String,
      required: [true, "role is required"],
    },
  },
  {
    timestamps: true,
  }
);

const writerRole = mongoose.model("writerRole", writerRoleSchema);

export default writerRole;
