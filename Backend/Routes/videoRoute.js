import express from "express";
import videoController from "../Controllers/videoController.js";
import verifyToken from "../Utils/verifyToken.js";

const router = express.Router();

router.get("/", videoController.getVideos);

router.post("/", verifyToken, videoController.postVideo);
router.put("/:id", verifyToken, videoController.update);
router.delete("/:id", verifyToken, videoController.remove);
router.get("/find/:id", videoController.getVideoById);
router.put("/view/:id", videoController.addViewer);
router.get("/trend", videoController.trend);
router.get("/random", videoController.random);
router.get("/sub",verifyToken, videoController.sub);
router.get("/tags", videoController.getByTag);
router.get("/search", videoController.search);


export { router as VideoRouter };
