import axios from "axios";
import type { AxiosResponse } from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME as string;
const PRESET_NAME = import.meta.env.VITE_PRESET as string;

interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
}

export const UploadService = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", PRESET_NAME);
    formData.append("cloud_name", CLOUD_NAME);

    const res: AxiosResponse<CloudinaryResponse> = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return res.data.secure_url || res.data.url || null;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};
