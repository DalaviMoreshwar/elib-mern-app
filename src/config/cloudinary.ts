import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinaryCloudName as string,
  api_key: config.cloudinaryApiKey as string,
  api_secret: config.cloudinaryApiSecret as string, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;
