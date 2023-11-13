import mongoose from "mongoose";

const sectionSchema = mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: [true, "book_id is required"],
    },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parent",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
  },
  {
    timestamps: true,
  }
);

const section = mongoose.model("section", sectionSchema);

export default section;
