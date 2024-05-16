import { request, response } from "express";
import Comment from "../Models/Comment.js";
import { ResponseError } from "../Config/error.js";
import Video from "../Models/Video.js";

/**
 * @param {request} req
 * @param {response} res
 */
const addComment = async (req, res, next) => {
  try {
    const comment = new Comment({
      ...req.body,
      userId: req.user.id,
      videoId: req.params.videoId,
    });

    if (!req.body) throw new ResponseError(400, "Comment cannot be empty");

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const deleteComment = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.id;

  try {
    const video = await Video.findById(videoId);
    const comment = await Comment.findById(req.params.id);

    if (userId === comment.userId || userId === video.userId) {
      await Comment.findByIdAndDelete(userId);

      res.status(200).json({ message: "Comment deleted" });
    } else {
      throw new ResponseError(
        403,
        "You are not authorized to delete this comment"
      );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({
      createdAt: -1,
    });

    if (!comments) {
      throw new ResponseError(404, "No comments found");
    }

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    if (!comments) {
      throw new ResponseError(404, "No comments found");
    }

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export default {
  addComment,
  deleteComment,
  getComment,
  getComments,
};
