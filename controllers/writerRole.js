import {
  createWriter,
  fetchWriter,
  removeWriter,
} from "../services/writerRoleServices.js";
import { STATUS_CODE } from "../utils/constants.js";

const createWriterRole = async (req, res) => {
  const result = await createWriter(req.body);
  return res.status(STATUS_CODE).json(result);
};

const getWriterRole = async (req, res) => {
  const result = await fetchWriter();
  return res.status(STATUS_CODE).json(result);
};

const deleteWriterRole = async (req, res) => {
  const result = await removeWriter(req.params.id);
  return res.status(STATUS_CODE).json(result);
};

export default {
  createWriterRole,
  getWriterRole,
  deleteWriterRole,
};
