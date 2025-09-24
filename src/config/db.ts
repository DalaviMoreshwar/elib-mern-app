import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`🫱🏻‍🫲🏻 Database handshake success!`);
    });

    mongoose.connection.on("error", (error) => {
      console.log(`Error in connecting database -  ${error}`);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log(`Failed to connect database: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
