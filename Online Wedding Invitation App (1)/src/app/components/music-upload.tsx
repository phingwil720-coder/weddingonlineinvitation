import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from './ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MusicUploadProps {
  onUploadComplete: (url: string, path: string) => void;
  folder?: string;
  buttonText?: string;
}

export function MusicUpload({ onUploadComplete, folder = 'music', buttonText = 'Upload Music' }: MusicUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload an audio file (MP3, WAV, OGG, or M4A)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('wedding-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-assets')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl, filePath);
      toast.success('Music uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading music:', error);
      toast.error(error.message || 'Failed to upload music');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="music-upload"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
      <label htmlFor="music-upload">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="cursor-pointer"
          asChild
        >
          <span>
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
          </span>
        </Button>
      </label>
      <p className="text-xs text-slate-500 mt-2">MP3, WAV, OGG, or M4A (Max 10MB)</p>
    </div>
  );
}
