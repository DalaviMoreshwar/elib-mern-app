import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { AuthRequest } from "../types/global-types.js";
import {
  generateImgSplitKey,
  generatePdfFileSplitKey,
  unlinkFile,
  uploadPdfFileOnCloud,
  uploadImgFileOnCloud,
} from "../utils/index.js";
import {
  createBookQuery,
  getBookQuery,
  updateBookQuery,
} from "../repositories/book-repository.js";

import cloudinary from "../config/cloudinary.js";
import bookModel from "../models/book-model.js";

// Controller: create a book
const createBookCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImgPath = files?.coverImage?.[0]?.path ?? "";
    const bookFilePath = files?.bookFile?.[0]?.path ?? "";

    // Validate required files
    if (!files?.coverImage?.[0] || !files?.bookFile?.[0]) {
      // Clean-up local files
      unlinkFile(coverImgPath);
      unlinkFile(bookFilePath);

      return next(
        createHttpError(400, "Both cover image and book file are required.")
      );
    }

    // Upload files on cloudinay
    const uploadCoverImgResult = await uploadImgFileOnCloud(coverImgPath);
    const uploadBookFileResult = await uploadPdfFileOnCloud(bookFilePath);

    // Clean-up local files
    unlinkFile(coverImgPath);
    unlinkFile(bookFilePath);

    const newBook = await createBookQuery(
      req,
      uploadCoverImgResult.secure_url,
      uploadBookFileResult.secure_url
    );

    res.status(201).json({
      message: "Book created successfully!",
      book: newBook._id,
    });
  } catch (error: any) {
    console.log(`Error::: ${error}`);
    return next(createHttpError(500, error));
  }
};

// Controller: update a book
const updateBookCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImgPath = files?.coverImage?.[0]?.path || "";
    const bookFilePath = files?.bookFile?.[0]?.path || "";

    const { bookId } = req.params;

    // Check book is already exist or not in db
    const book = await getBookQuery(bookId);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // check the correct user is updating the book
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(
        createHttpError(403, "You're unauthorized user to update this book")
      );
    }

    // check if the image and file fields are exist or not
    let coverImgURI = "";
    if (files?.coverImage) {
      // delete old image before update new one
      const coverImagePublicId = generateImgSplitKey(book.coverImage);
      try {
        await cloudinary.uploader.destroy(coverImagePublicId);
      } catch (error: any) {
        return next(createHttpError(500, error));
      }

      const uploadCoverImgResult = await uploadImgFileOnCloud(coverImgPath);
      coverImgURI = uploadCoverImgResult.secure_url;

      unlinkFile(coverImgPath);
    }

    let bookURI = "";
    if (files?.bookFile) {
      // delete old book pdf before update new one
      const filePublicId = generatePdfFileSplitKey(book.bookFile);
      try {
        await cloudinary.uploader.destroy(filePublicId, {
          resource_type: "raw",
        });
      } catch (error: any) {
        return next(createHttpError(500, error));
      }

      const uploadBookFileResult = await uploadPdfFileOnCloud(bookFilePath);
      bookURI = uploadBookFileResult.secure_url;

      unlinkFile(bookFilePath);
    }

    const updatedBook = await updateBookQuery(
      req,
      coverImgURI,
      bookURI,
      book.coverImage,
      book.bookFile
    );

    res.status(200).json({
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error: any) {
    console.log(`Error::: ${error}`);
    return next(createHttpError(500, error));
  }
};

const listBooksCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: add pagenation - mongoose pagination
    const books = await bookModel.find();

    res.status(200).json(books);
  } catch (error: any) {
    return next(createHttpError(500, error));
  }
};

const getBookCtrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const book = await getBookQuery(bookId);

    if (!book) {
      return next(createHttpError(404, "Book not found!"));
    }

    res.status(200).json(book);
  } catch (error: any) {
    return next(createHttpError(500, error));
  }
};

const deleteBookCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const book = await getBookQuery(bookId);
    if (!book) {
      return next(createHttpError(404, "Book not found for delete!"));
    }

    // Check access
    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(
        createHttpError(403, "You're unauthorized user to delete this book")
      );
    }

    const coverImagePublicId = generateImgSplitKey(book.coverImage);

    const filePublicId = generatePdfFileSplitKey(book.bookFile);

    try {
      await cloudinary.uploader.destroy(coverImagePublicId);
      await cloudinary.uploader.destroy(filePublicId, {
        resource_type: "raw",
      });
    } catch (error: any) {
      return next(createHttpError(500, error));
    }

    const deletedBook = await bookModel.deleteOne({ _id: bookId });

    res.status(204).json({ coverImagePublicId, filePublicId });
  } catch (error: any) {
    return next(createHttpError(500, error));
  }
};

export {
  createBookCtrl,
  updateBookCtrl,
  listBooksCtrl,
  getBookCtrl,
  deleteBookCtrl,
};
