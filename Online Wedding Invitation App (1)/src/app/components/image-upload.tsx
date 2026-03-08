import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadImage, validateImageFile } from '../../lib/storage';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadComplete: (url: string, path: string) => void;
  folder?: string;
  accept?: string;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  multiple?: boolean;
}

export function ImageUpload({
  onUploadComplete,
  folder = '',
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  className = '',
  buttonText = 'Upload Image',
  showPreview = false,
  multiple = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesToUpload = multiple ? Array.from(files) : [files[0]];

    // Validate all files first
    for (const file of filesToUpload) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        return;
      }
    }

    // Upload files
    try {
      setUploading(true);
      let successCount = 0;
      
      for (const file of filesToUpload) {
        const result = await uploadImage(file, folder);
        onUploadComplete(result.url, result.path);
        successCount++;
      }
      
      if (successCount > 1) {
        toast.success(`${successCount} images uploaded successfully`);
      } else {
        toast.success('Image uploaded successfully');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      setPreview(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        multiple={multiple}
      />
      
      {preview && showPreview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-slate-200"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full"
          variant="outline"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
}