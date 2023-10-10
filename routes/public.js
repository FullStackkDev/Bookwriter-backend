import express from "express";
import user from "../controllers/user.js";

const router = express.Router();

router.post("/login", user.login);
router.post("/third-party-user-login", user.thirdPartyUserLogin);
router.post("/register-user", user.registerUser);

export default router;
