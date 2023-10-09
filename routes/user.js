// user routes
import express from "express";
import user from "../controllers/user.js";

const router = express.Router();

router.post("/login", user.login);
router.post("/register-user", user.registerUser);
router.put("/user/:id", user.updateUser);
router.delete("/user/:id", user.deleteUser);

export default router;
