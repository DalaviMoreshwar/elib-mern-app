import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import userModels from "./userModels";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // validation
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // database calls
  const user = await userModels.findOne({ email });

  if (user) {
    const error = createHttpError(
      "400",
      "User already exists with this email!"
    );
    return next(error);
  }

  // hash pasword
  const hashedPassword = await bcrypt.hash(password, 10);

  res.json({ message: "user has created!" });
};

export { createUser };
