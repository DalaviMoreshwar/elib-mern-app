import { User } from "./user-types";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  bookFile: string;
  createdAt: Date;
  updatedAt: Date;
}
