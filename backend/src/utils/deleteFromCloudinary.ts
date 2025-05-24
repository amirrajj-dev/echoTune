import cloudinary from './cloudinary';

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
    throw new Error(`Failed to delete ${publicId} from Cloudinary`);
  }
};
