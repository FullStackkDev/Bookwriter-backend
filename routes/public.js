import express from "express";
import user from "../controllers/user.js";

const router = express.Router();

router.post("/login", user.login);
router.post("/user", user.createUser);

export default router;
