import express from "express";
import authController from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout);

export { router as AuthRouter };