import mongoose from "mongoose";

const sectionSchema = mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    parent_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parent",
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const section = mongoose.model("section", sectionSchema);

export default section;
