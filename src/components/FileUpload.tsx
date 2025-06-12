import React, { useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Attachment } from '../types/chat';

interface FileUploadProps {
  attachments: Attachment[];
  onFilesSelect: (files: FileList) => void;
  onRemoveAttachment: (id: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  attachments,
  onFilesSelect,
  onRemoveAttachment,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files);
      // Reset input
      e.target.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.startsWith('text/') || type.includes('document')) return <FileText size={16} />;
    return <File size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* File attachments display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <div className="text-gray-500">
                {getFileIcon(attachment.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {attachment.name}
                </div>
                <div className="text-gray-500 text-xs">
                  {formatFileSize(attachment.size)}
                </div>
              </div>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,text/*,.pdf,.doc,.docx,.json,.csv"
        disabled={disabled}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleFileClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload files"
      >
        <Upload size={16} />
        <span>Upload files</span>
      </button>
    </div>
  );
};