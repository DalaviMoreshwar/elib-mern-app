import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { User } from "../types/user-types.js";

import userModels from "../models/user-model.js";
import userModel from "../models/user-model.js";
import tokenGen from "../services/token-generation-service.js";

const createUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validation
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  // database calls
  try {
    const user = await userModels.findOne({ email });

    if (user) {
      return next(
        createHttpError("400", "User already exists with this email!")
      );
    }
  } catch (error) {
    return next(createHttpError("500", "Error while getting user."));
  }

  // hash pasword
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user."));
  }

  try {
    // jwt token generation
    const token = tokenGen(newUser._id);

    // response
    res.status(201).json({ message: "Register success!", accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while accessing the jwt token"));
  }
};

const loginUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required!"));
  }

  let user: User | null;

  try {
    user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(error);
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createHttpError(400, "Username or password is incorrect!"));
    }

    // jwt token generation
    const token = tokenGen(user._id);

    // response
    res.status(200).json({ message: "Login success!", accessToken: token });
  } catch (error) {
    return next(error);
  }
};

export { createUserCtrl, loginUserCtrl };
