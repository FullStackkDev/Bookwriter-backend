import Section from "../models/sectionSchema.js";
import {
  CREATED,
  UPDATED,
  DELETED,
  FETCHED,
  NOT_FOUND,
} from "../utils/messages.js";
import { getSectionValidationErrors } from "../utils/utils.js";

export const create = async (sectionData) => {
  try {
    let payload = {};
    const section = await Section.create(sectionData);

    payload = {
      message: `Section ${CREATED}`,
      payload: section,
      success: true,
    };

    return payload;
  } catch (error) {
    let validationErrors = getSectionValidationErrors(error);
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

export const fetch = async () => {
  try {
    let payload = {};
    const section = await Section.find();

    payload = {
      message: `Section ${FETCHED}`,
      payload: section,
      success: true,
    };

    return payload;
  } catch (error) {
    return { message: error.message, success: false };
  }
};

export const update = async (id, updatedData) => {
  try {
    let payload = {};

    const updatedSection = await Section.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedSection) {
      payload = {
        message: `Section ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `Section ${UPDATED}`,
        payload: updatedSection,
        success: true,
      };
    }

    return payload;
  } catch (error) {
    let validationErrors = getSectionValidationErrors(error);
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

    const section = await deleteSectionAndSubsections(id);
    if (!section) {
      payload = {
        message: `Section ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `Section ${DELETED}`,
        payload: id,
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

async function deleteSectionAndSubsections(sectionId) {
  // Find the section to be deleted
  const sectionToDelete = await Section.findOne({ _id: sectionId });
  if (!sectionToDelete) {
    return null;
  }
  // Delete the section
  await Section.deleteOne({ _id: sectionId });

  // Find and delete sub-sections recursively
  const subSections = await Section.find({ parent_section_id: sectionId });
  for (const subSection of subSections) {
    await deleteSectionAndSubsections(subSection._id);
  }
  return true;
}
