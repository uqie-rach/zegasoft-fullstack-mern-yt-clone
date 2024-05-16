import express from "express";
import commentController from "../Controllers/commentController.js";
import verifyToken from "../Utils/verifyToken.js";

const router = express.Router();

router.get('/', commentController.getComments)

router.post('/:videoId', verifyToken, commentController.addComment)
router.delete('/:id', verifyToken, commentController.deleteComment)
router.get('/:videoId', commentController.getComment)

export { router as CommentRouter };
