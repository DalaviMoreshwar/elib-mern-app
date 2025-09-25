import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * 1. validation
   * 2. process
   * 3. Response
   */

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  res.json({ message: "user has created!" });
};

export { createUser };
