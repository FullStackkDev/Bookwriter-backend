import express from "express";
import writerRole from "../controllers/writerRole.js";

const router = express.Router();

router.get("/writer-role", writerRole.getWriterRole);
router.post("/writer-role", writerRole.createWriterRole);
router.delete("/writer-role/:id", writerRole.deleteWriterRole);

export default router;
