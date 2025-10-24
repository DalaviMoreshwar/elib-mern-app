import path from "node:path";
import express from "express";
import multer from "multer";

import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "./bookController";
import authenticate from "../middlewares/authenticate.middleware";

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

bookRouter.get("/", listBooks);

bookRouter.get("/:bookId", getBook);

bookRouter.delete("/:bookId", authenticate, deleteBook);

bookRouter.post(
  "/",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "bookFile" }]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "bookFile" }]),
  updateBook
);

export default bookRouter;
