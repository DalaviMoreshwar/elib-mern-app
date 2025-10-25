import express from "express";

import upload from "./../services/file-storage-service.js";
import authenticate from "../middlewares/authenticate-middleware.js";
import {
  createBookCtrl,
  deleteBookCtrl,
  getBookCtrl,
  listBooksCtrl,
  updateBookCtrl,
} from "../controllers/book-controller.js";

const bookRoutes = express.Router();

bookRoutes.get("/", listBooksCtrl);

bookRoutes.get("/:bookId", getBookCtrl);

bookRoutes.delete("/:bookId", authenticate, deleteBookCtrl);

bookRoutes.post(
  "/",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "bookFile" }]),
  createBookCtrl
);

bookRoutes.patch(
  "/:bookId",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "bookFile" }]),
  updateBookCtrl
);

export default bookRoutes;
