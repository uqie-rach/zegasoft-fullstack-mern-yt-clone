import express from "express";
import userController from "../Controllers/userController.js";
import verifyToken from "../Utils/verifyToken.js";

const router = express.Router();

// test routes
router.get("/", userController.getUsers);

router.get("/find/:id", userController.getUserById);
router.put("/:id", verifyToken, userController.update);
router.put("/sub/:id", verifyToken, userController.subscribe);
router.put("/unsub/:id", verifyToken, userController.unsubscribe);
router.put("/like/:videoId", verifyToken, userController.like);
router.put("/dislike/:videoId", verifyToken, userController.dislike);
router.delete("/:id", verifyToken, userController.remove);

export { router as UserRouter };
