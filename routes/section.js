import express from "express";
import section from "../controllers/section.js";

const router = express.Router();

router.get("/section", section.getSection);
router.post("/section", section.createSection);
router.put("/section/:id", section.updateSection);
router.delete("/section/:id", section.deleteSection);

export default router;
