import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true, // email should be unique
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// mongo db will create a collection - [users]
export default mongoose.model<User>("User", userSchema);
