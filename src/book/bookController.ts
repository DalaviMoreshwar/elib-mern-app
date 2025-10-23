import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImgPath = files?.coverImage?.[0]?.path || "";
    const bookFilePath = files?.bookFile?.[0]?.path || "";

    const uploadCoverImgResult = await cloudinary.uploader
      .upload(coverImgPath, {
        folder: "cover-images",
      })
      .catch((error) => {
        return next(createHttpError(500, error));
      });

    const uploadBookFileResult = await cloudinary.uploader
      .upload(bookFilePath, {
        folder: "books",
        resource_type: "raw",
      })
      .catch((error) => {
        return next(createHttpError(500, error));
      });

    const newBook = await bookModel.create({
      title: req.body.title,
      author: req.body.author,
      genere: req.body.genere,
      coverImage: uploadCoverImgResult?.secure_url,
      bookFile: uploadBookFileResult?.secure_url,
    });

    // Delete temp files
    try {
      await fs.promises.unlink(coverImgPath);
      await fs.promises.unlink(bookFilePath);
      console.log(`Files deleted from local.`);
    } catch (error: any) {
      console.log(`Error::: ${error}`);
      return next(createHttpError(500, error));
    }

    res.status(201).json({
      message: "Uploaded successfully!",
      book: newBook,
    });
  } catch (error: any) {
    console.log(`Error::: ${error}`);
    return next(createHttpError(500, error));
  }
};

export { createBook };
