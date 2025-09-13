import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const generateSignature = (publicId: string, timestamp: number) => {
  return cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  );
};