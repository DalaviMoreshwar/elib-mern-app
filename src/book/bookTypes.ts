import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genere: string;
  coverImage: string;
  bookFile: string;
  createdAt: Date;
  updatedAt: Date;
}
