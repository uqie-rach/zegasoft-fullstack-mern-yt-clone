import { request, response } from "express";
import User from "../Models/User.js";
import { ResponseError } from "../Config/error.js";
import Video from "../Models/Video.js";
import mongoose from "mongoose";

/**
 *
 * @param {request} req
 * @param {response} res
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length < 1)
      throw new ResponseError("No users found", 404);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const getUserById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ResponseError("User not found", 404);
    }
    const user = await User.findById(req.params.id, { password: false });

    if (!user) throw new ResponseError("User not found", 404);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const update = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      next(err);
    }
  } else {
    next(new ResponseError("You can update only your account", 403));
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const subscribe = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };

    // Check if the user is already subscribed
    const isSubscribed = await User.findOne({
      $and: [{ _id: req.user.id }, { subscribedUsers: req.params.id }],
    }).session(session);

    if (isSubscribed)
      throw new ResponseError("User is already subscribed", 400);

    // Update the user's subscribedUsers array
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { subscribedUsers: req.params.id },
      },
      opts
    );

    // Update the user's subscriber count
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { subscriber: 1 },
      },
      opts
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const unsubscribe = async (req, res, next) => {
  try {
    // Check if the user is already subscribed
    const isSubscribed = await User.findOne({
      $and: [{ _id: req.user.id }, { subscribedUsers: req.params.id }],
    });

    if (!isSubscribed) throw new ResponseError("User is not subscribed", 404);

    // Update the user's subscribedUsers array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });

    // Update the user's subscriber count
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscriber: -1 },
    });

    res.status(200).json({ message: "Unsubscribed" });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });

    res.status(200).json({ message: "Liked" });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });

    res.status(200).json({ message: "disliked" });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) throw new ResponseError("User not found", 404);

    console.info(user);

    res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    next(err);
  }
};

export default {
  getUsers,
  getUserById,
  update,
  subscribe,
  unsubscribe,
  like,
  dislike,
  remove,
};
