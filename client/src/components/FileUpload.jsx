import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/upload.api';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const FileUpload = ({ onUploadSuccess, label = "Upload File", accept = "image/*" }) => {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadFile(file),
    onSuccess: (data) => {
      setError(null);
      if (onUploadSuccess) onUploadSuccess(data.url);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Upload failed. Are Cloudinary credentials set?');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    uploadMutation.mutate(file);
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          uploadMutation.isPending 
            ? 'border-slate-200 bg-slate-50 cursor-wait' 
            : uploadMutation.isSuccess 
            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100'
            : error 
            ? 'border-red-500 bg-red-50 hover:bg-red-100'
            : 'border-brand-300 hover:border-brand-500 bg-brand-50/50 hover:bg-brand-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          className="hidden" 
        />
        
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : uploadMutation.isSuccess ? (
          <div className="flex flex-col items-center text-emerald-600">
            <CheckCircle className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Upload Complete!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-brand-600">
            <UploadCloud className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : ''}`} />
            <span className={`text-sm font-medium ${error ? 'text-red-600' : ''}`}>
              {error || label}
            </span>
            {!error && <span className="text-xs text-brand-400 mt-1">Max size: 5MB</span>}
          </div>
        )}
      </div>
    </div>
  );
};
