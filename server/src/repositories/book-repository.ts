import { Request } from "express";

import bookModel from "../models/book-model.js";
import { AuthRequest } from "../types/global-types.js";

export const getBookQuery = async (bookId: string) => {
  return await bookModel.findOne({ _id: bookId });
};

export const createBookQuery = async (
  req: Request,
  uploadCoverImgUrl: string,
  uploadBookFileUrl: string
) => {
  // Type casting
  const _req = req as AuthRequest;

  const result = bookModel.create({
    title: req.body.title,
    author: _req.userId,
    genre: req.body.genre,
    coverImage: uploadCoverImgUrl,
    bookFile: uploadBookFileUrl,
  });

  return result;
};

export const updateBookQuery = async (
  req: Request,
  coverImgURI: string,
  bookURI: string,
  coverImage: string,
  bookFile: string
) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;

  const result = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title,
      genre,
      coverImage: coverImgURI ? coverImgURI : coverImage,
      bookFile: bookURI ? bookURI : bookFile,
    },
    {
      new: true,
    }
  );

  return result;
};
