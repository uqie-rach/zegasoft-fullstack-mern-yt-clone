import { request, response } from "express";
import User from "../Models/User.js";
import { ResponseError } from "../Config/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateTokenAndSetCookie from "../Utils/generateToken.js";

/**
 *
 * @param {request} req
 * @param {response} res
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const isUserExist = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (isUserExist) throw new ResponseError("Cannot use credentials", 400);

    const newUser = new User({ name, email, password: hash });
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
    const { email, name, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (!user) throw new ResponseError("User not found", 404);

    const { password: hashedPassword, ...rest } = user.toObject();
    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordValid) throw new ResponseError("Wrong credentials", 401);

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Successfully logged in!",
      data: rest,
    });
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
      .clearCookie("jwt")
      .status(200)
      .json({ message: "Logged out!" });
  } catch (error) {
    next(error);
  }
};

export default { signup, signin, logout };
