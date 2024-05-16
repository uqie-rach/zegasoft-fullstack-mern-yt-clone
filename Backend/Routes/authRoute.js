import express from "express";
import authController from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout);
router.post("/google", authController.googleSignin);

export { router as AuthRouter };