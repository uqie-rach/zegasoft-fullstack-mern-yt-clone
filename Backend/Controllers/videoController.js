import { request, response } from "express";
import Video from "../Models/Video.js";
import { ResponseError } from "../Config/error.js";
import User from "../Models/User.js";

/**
 * @param {request} req
 * @param {response} res
 */
const getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find();

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const postVideo = async (req, res, next) => {
  const userId = req.user.id;
  const { title, desc, imgUrl, videoUrl } = req.body;
  try {
    const requiredFields = { title, desc, imgUrl, videoUrl };
    const emptyFields = [];

    for (const field in requiredFields) {
      if (!requiredFields[field]) {
        emptyFields.push(field);
      }
    }
    const errorMessage = `Missing required field: ${emptyFields.join(", ")}`;

    if (emptyFields.length > 0) {
      throw new ResponseError(errorMessage, 400);
    }

    const newVideo = new Video({ userId: userId, ...req.body });

    newVideo.save();
    res.status(201).json({ message: "Uploaded Successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const update = async (req, res, next) => {
  const userId = req.user.id;
  const body = {};
  const videoId = req.params.id;

  try {
    const { title, imgUrl, desc } = req.body;

    if (!title && !imgUrl && !desc)
      throw new ResponseError("No data to update", 400);

    if (title) body["title"] = title;
    if (imgUrl) body["imgUrl"] = imgUrl;
    if (desc) body["desc"] = desc;

    const video = await Video.findById(videoId);
    if (!video) throw new ResponseError("Video is not found", 404);

    if (userId === video.userId) {
      await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: body,
        },
        { new: true }
      );

      res.status(200).json({ message: "Updated Successfully" });
    } else {
      throw new ResponseError("You can only update your own video", 403);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const remove = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.id;

  try {
    const video = await Video.findById(videoId);
    if (!video) throw new ResponseError("Video is not found", 404);

    if (userId === video.userId) {
      await Video.findByIdAndDelete(videoId);

      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      throw new ResponseError("You can only delete your own video", 403);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) throw new ResponseError("Video not found", 404);

    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const addViewer = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({ message: "Viewers increased" });
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const videos = await Promise.all(
      subscribedChannels.map(async (subs) => {
        return await Video.find({ userId: subs });
      })
    );

    const uniqueVideos = Array.from(new Set(videos.flat()));

    res.status(200).json(uniqueVideos.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
const search = async (req, res, next) => {
  const title = req.query.title;
  try {
    const videos = await Video.find({
      title: { $regex: title, $options: "i" },
    }).limit(20);

    if (!videos) throw new ResponseError("No videos found", 404);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export default {
  getVideos,
  postVideo,
  update,
  remove,
  getVideoById,
  addViewer,
  trend,
  random,
  sub,
  getByTag,
  search,
};
