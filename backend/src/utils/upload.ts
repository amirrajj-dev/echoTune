import fs from "fs";
import cloudinary from "./cloudinary";

export const uploadToCloudinary = async (
  file: any
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error in Cloudinary upload => ", error);
    throw new Error("Error uploading file to Cloudinary");
  }
};
