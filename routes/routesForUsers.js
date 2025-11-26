
import express from "express";
import { getMyProfile, login, logout, register } from "../controllers/user.js";
import isVerified from "../middleware/userIdentify.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.get("/me", isVerified, getMyProfile);

export default router;