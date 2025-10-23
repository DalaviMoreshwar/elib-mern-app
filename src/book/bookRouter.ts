import path from "node:path";
import express from "express";
import multer from "multer";

import { createBook } from "./bookController";

const imgStorage = multer.diskStorage({
  destination: function (req, res, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: imgStorage, limits: { fileSize: 1e7 } });

const bookRouter = express.Router();

bookRouter.post(
  "/",
  upload.fields([{ name: "coverImage" }, { name: "bookFile" }]),
  createBook
);

export default bookRouter;
