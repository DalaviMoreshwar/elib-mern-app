import express from "express";

import {
  createUserCtrl,
  loginUserCtrl,
} from "../controllers/user-controller.js";

const userRoutes = express.Router();

userRoutes.post("/register", createUserCtrl);
userRoutes.post("/login", loginUserCtrl);

export default userRoutes;
