import jwt from "jsonwebtoken";

import { config } from "../config/config.js";

const tokenGen = (userId: string) => {
  const token = jwt.sign(
    {
      sub: userId,
    },
    config.jwtSecret as string,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    }
  );

  return token;
};

export default tokenGen;
