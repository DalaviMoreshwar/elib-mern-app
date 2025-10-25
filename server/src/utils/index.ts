import cloudinary from "../config/cloudinary.js";
import fs from "node:fs";

// Upload image on cloudinary
export async function uploadImgFileOnCloud(imgFilePath: string) {
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

// Upload file (pdf) on cloudinary
export async function uploadPdfFileOnCloud(filePath: string) {
  const result = await cloudinary.uploader
    .upload(filePath, {
      folder: "book-pdfs",
      resource_type: "raw",
    })
    .catch((error) => {
      console.log("File upload fail::: ", error);
      throw new Error("Failed to upload file to cloudinary");
    });

  return result;
}

export async function unlinkFile(relativePath: string) {
  // Delete temp files
  try {
    await fs.promises.unlink(relativePath);
    console.log(`Files deleted from local.`);
  } catch (error: any) {
    console.log(`Error::: ${error}`);
    throw new Error("No such file or directory, unlink ''");
  }
}

// Create public ID as per cloudinary
export function generateImgSplitKey(imgUrl: string) {
  const baseStr = imgUrl.split("/");
  const splitedResultSrt = baseStr.at(-2) + "/" + baseStr.at(-1)?.split(".")[0];

  return splitedResultSrt;
}

// Create public ID as per cloudinary for pdf file
export function generatePdfFileSplitKey(fileUrl: string) {
  const baseStr = fileUrl.split("/");
  const splitedResultStr = baseStr.at(-2) + "/" + baseStr.at(-1);

  return splitedResultStr;
}
