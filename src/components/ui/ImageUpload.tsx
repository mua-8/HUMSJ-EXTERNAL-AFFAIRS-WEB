import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, CloudinaryUploadResponse, UploadProgress } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUploadComplete: (result: CloudinaryUploadResponse) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload = ({
  onUploadComplete,
  onRemove,
  currentImage,
  className = "",
  maxSizeMB = 10,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload: ${acceptedFormats.map(f => f.split("/")[1]).join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file, (p: UploadProgress) => {
        setProgress(p.percentage);
      });

      setPreview(result.secure_url);
      onUploadComplete(result);

      toast({
        title: "Upload successful",
        description: "Image uploaded to Cloudinary",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setPreview(null);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <X size={14} />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? "border-[#1a9e98] bg-[#1a9e98]/5" 
              : "border-gray-300 hover:border-[#1a9e98] hover:bg-gray-50"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#1a9e98] mb-3" />
              <p className="text-sm text-gray-600">Uploading... {progress}%</p>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-[#1a9e98] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF, WebP (max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
