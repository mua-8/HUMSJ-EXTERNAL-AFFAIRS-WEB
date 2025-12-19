// Cloudinary Configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dxvfnj1ja",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "843658226827987",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "humsj.islam",
};

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  original_filename: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload an image to Cloudinary
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the upload response
 */
export const uploadImage = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        let errorMessage = `Upload failed with status ${xhr.status}`;
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse.error?.message) {
            errorMessage = errorResponse.error.message;
          }
        } catch (e) {
          // Use default error message
        }
        console.error("Cloudinary upload error:", xhr.responseText);
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timed out"));
    });

    xhr.open("POST", uploadUrl);
    xhr.timeout = 60000; // 60 second timeout
    xhr.send(formData);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of files to upload
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of upload responses
 */
export const uploadMultipleImages = async (
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<CloudinaryUploadResponse[]> => {
  const results: CloudinaryUploadResponse[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i]);
    results.push(result);
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return results;
};

/**
 * Generate a Cloudinary URL with transformations
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 * @returns Transformed image URL
 */
export const getImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "jpg" | "png";
  }
): string => {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options || {};
  
  let transformations = `q_${quality},f_${format}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (width || height) transformations += `,c_${crop}`;
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Delete an image from Cloudinary (requires backend for security)
 * Note: For production, this should be done through a backend API
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  console.warn("Image deletion should be handled by a backend service for security");
  // In production, call your backend API to delete the image
};
