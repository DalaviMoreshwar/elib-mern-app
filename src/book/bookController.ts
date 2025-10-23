import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";

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

    res.json({
      message: "Uploaded successfully!",
      coverImgURL: uploadCoverImgResult?.url,
      bookURL: uploadBookFileResult?.url,
    });
  } catch (error) {
    console.log(`Error::: ${error}`);
    return next(createHttpError(500, "Error whilr uploading the files."));
  }
};

export { createBook };
