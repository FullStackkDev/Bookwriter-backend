import Writer from "../models/writerRoleSchema.js";
import { CREATED, DELETED, FETCHED, NOT_FOUND } from "../utils/messages.js";
import { getWriterRoleValidationErrors } from "../utils/utils.js";

export const createWriter = async (writerData) => {
  try {
    let payload = {};
    const writer = await Writer.create(writerData);

    payload = {
      message: `Writer Role ${CREATED}`,
      payload: writer,
      success: true,
    };

    return payload;
  } catch (error) {
    let validationErrors = getWriterRoleValidationErrors(error);
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

export const fetchWriter = async () => {
  try {
    let payload = {};
    const writerRole = await Writer.find();

    payload = {
      message: `Writer role ${FETCHED}`,
      payload: writerRole,
      success: true,
    };

    return payload;
  } catch (error) {
    return { message: error.message, success: false };
  }
};

export const removeWriter = async (id) => {
  try {
    let payload = {};

    const deletedWriterRole = await Writer.findByIdAndDelete(id);
    if (!deletedWriterRole) {
      payload = {
        message: `Writer role ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `Writer role ${DELETED}`,
        payload: deletedWriterRole,
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

export const removeWritersByBookId = async (id) => {
  try {
    let payload = {};

    const writerRoleToDelete = await Writer.find({ book_id: id });
    const deleteWriterRoles = await Writer.deleteMany({
      book_id: id,
    });

    if (!deleteWriterRoles.deletedCount) {
      payload = {
        message: `Writer role ${NOT_FOUND}`,
        success: false,
      };
    } else {
      payload = {
        message: `Writer role ${DELETED}`,
        payload: writerRoleToDelete,
        count: deleteWriterRoles.deletedCount,
        success: true,
      };
    }

    return payload;
  } catch (error) {
    throw error;
  }
};
