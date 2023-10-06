import mongoose from "mongoose";

const writerRoleSchema = mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const writerRole = mongoose.model("writerRole", writerRoleSchema);

export default writerRole;
