import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate.middleware";

async function uploadImgOnCloud(imgFilePath: string) {
  const result = await cloudinary.uploader
    .upload(imgFilePath, {
      folder: "cover-images",
    })
    .catch((error) => {
      console.log("Img File upload fail::: ", error);
      throw new Error("Failed to upload file to cloudinary");
    });

  return result;
}

async function uploadFileOnCloud(filePath: string) {
  const result = await cloudinary.uploader
    .upload(filePath, {
      folder: "books",
      resource_type: "raw",
    })
    .catch((error) => {
      console.log("File upload fail::: ", error);
      throw new Error("Failed to upload file to cloudinary");
    });

  return result;
}

async function unlinkFile(relativePath: string) {
  // Delete temp files
  try {
    await fs.promises.unlink(relativePath);
    console.log(`Files deleted from local.`);
  } catch (error: any) {
    console.log(`Error::: ${error}`);
    throw new Error("No such file or directory, unlink ''");
  }
}

function generateImgSplitKey(imgUrl: string) {
  const baseStr = imgUrl.split("/");
  const splitedResultSrt = baseStr.at(-2) + "/" + baseStr.at(-1)?.split(".")[0];

  return splitedResultSrt;
}

function generatePdfFileSplitKey(fileUrl: string) {
  const baseStr = fileUrl.split("/");
  const splitedResultStr = baseStr.at(-2) + "/" + baseStr.at(-1);

  return splitedResultStr;
}

// Controller: create a book
const createBook = async (req: Request, res: Response, next: NextFunction) => {
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
    const uploadCoverImgResult = await uploadImgOnCloud(coverImgPath);
    const uploadBookFileResult = await uploadFileOnCloud(bookFilePath);

    // Clean-up local files
    unlinkFile(coverImgPath);
    unlinkFile(bookFilePath);

    // Type casting
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title: req.body.title,
      author: _req.userId,
      genre: req.body.genre,
      coverImage: uploadCoverImgResult.secure_url,
      bookFile: uploadBookFileResult?.secure_url,
    });

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
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { title, genre } = req.body;
    const { bookId } = req.params;

    const coverImgPath = files?.coverImage?.[0]?.path || "";
    const bookFilePath = files?.bookFile?.[0]?.path || "";

    // Check book is already exist or not in db
    const book = await bookModel.findOne({ _id: bookId });

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

      const uploadCoverImgResult = await uploadImgOnCloud(coverImgPath);
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

      const uploadBookFileResult = await uploadFileOnCloud(bookFilePath);
      bookURI = uploadBookFileResult.secure_url;
      unlinkFile(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title,
        genre,
        coverImage: coverImgURI ? coverImgURI : book.coverImage,
        bookFile: bookURI ? bookURI : book.bookFile,
      },
      {
        new: true,
      }
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

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: add pagenation - mongoose pagination
    const books = await bookModel.find();

    res.status(200).json(books);
  } catch (error: any) {
    return next(createHttpError(500, error));
  }
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found!"));
    }

    res.status(200).json(book);
  } catch (error: any) {
    return next(createHttpError(500, error));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const book = await bookModel.findOne({ _id: bookId });
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

export { createBook, updateBook, listBooks, getBook, deleteBook };
