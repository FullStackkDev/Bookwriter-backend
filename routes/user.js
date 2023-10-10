// user routes
import express from "express";
import user from "../controllers/user.js";

const router = express.Router();

router.get("/user", user.getUser);
router.put("/user/:id", user.updateUser);
router.put("/user/update-password/:id", user.updateUserPassword);
router.delete("/user/:id", user.deleteUser);

export default router;
