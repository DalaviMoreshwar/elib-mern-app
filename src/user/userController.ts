import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import createHttpError from "http-errors";

import userModels from "./userModel";
import userModel from "./userModel";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // validation
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // database calls
  try {
    const user = await userModels.findOne({ email });

    if (user) {
      const error = createHttpError(
        "400",
        "User already exists with this email!"
      );
      return next(error);
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
    const token = sign(
      {
        sub: (await newUser)._id,
      },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
      }
    );

    // response
    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while accessing the jwt token"));
  }
};

export { createUser };
