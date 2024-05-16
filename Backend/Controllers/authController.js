import { request, response } from "express";
import User from "../Models/User.js";
import { ResponseError } from "../Config/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 *
 * @param {request} req
 * @param {response} res
 */
const signup = async (req, res, next) => {
  try {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);

    const isUserExist = await User.findOne({
      $or: [{ email: body.email }, { name: body.name }],
    });

    if (isUserExist) throw new ResponseError("Cannot use credentials", 400);

    const newUser = new User({ ...body, password: hash });
    await newUser.save();

    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const signin = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findOne({
      $or: [{ email: body.email }, { name: body.name }],
    });

    if (!user) throw new ResponseError("User not found", 404);

    const { password, ...rest } = user.toObject();
    const hashedPasswd = bcrypt.compareSync(body.password, password);

    if (!hashedPasswd) throw new ResponseError("Wrong credentials", 401);

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const googleSignin = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user) {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser.toObject());
      return;
    }

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user.toObject());
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Logged out!" });
  } catch (error) {
    next(error);
  }
};

export default { signup, signin, logout, googleSignin };
