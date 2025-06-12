import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { AudioRecorder } from './AudioRecorder';
import { useFileHandler } from '../hooks/useFileHandler';
import { Attachment } from '../types/chat';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: Attachment[], audioBlob?: Blob) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleFileSelect } = useFileHandler();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(input.trim(), attachments.length > 0 ? attachments : undefined);
      setInput('');
      setAttachments([]);
      setShowFileUpload(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFilesSelect = async (files: FileList) => {
    try {
      const newAttachments = await handleFileSelect(files);
      setAttachments(prev => [...prev, ...newAttachments]);
      setShowFileUpload(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process files');
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== id);
      if (updated.length === 0) {
        setShowFileUpload(false);
      }
      return updated;
    });
  };

  const handleAudioRecorded = (audioBlob: Blob) => {
    onSendMessage('', undefined, audioBlob);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* File upload area */}
      {showFileUpload && (
        <div className="p-4 border-b border-gray-100">
          <FileUpload
            attachments={attachments}
            onFilesSelect={handleFilesSelect}
            onRemoveAttachment={handleRemoveAttachment}
            disabled={disabled}
          />
        </div>
      )}

      {/* Input area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={disabled}
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 max-h-30"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex gap-1">
              <button
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`p-1 transition-colors ${
                  showFileUpload || attachments.length > 0
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Attach files"
                disabled={disabled}
              >
                <Paperclip size={16} />
              </button>
              <AudioRecorder
                onAudioRecorded={handleAudioRecorded}
                disabled={disabled}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || disabled}
            className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};