import { create, fetch, update, remove } from "../services/sectionServices.js";
import { STATUS_CODE } from "../utils/constants.js";

const createSection = async (req, res) => {
  const result = await create(req.body);
  return res.status(STATUS_CODE).json(result);
};

const getSection = async (req, res) => {
  const result = await fetch();
  return res.status(STATUS_CODE).json(result);
};

const updateSection = async (req, res) => {
  const result = await update(req.params.id, req.body);
  return res.status(STATUS_CODE).json(result);
};

const deleteSection = async (req, res) => {
  const result = await remove(req.params.id);
  return res.status(STATUS_CODE).json(result);
};

export default {
  createSection,
  getSection,
  updateSection,
  deleteSection,
};
