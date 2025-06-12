import React, { useState } from 'react';
import { Bot, User, Copy, Check, AlertCircle, Download, Volume2, VolumeX } from 'lucide-react';
import { Message } from '../types/chat';
import { AudioPlayer } from './AudioPlayer';
import { openAIService } from '../services/openai';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [speechUrl, setSpeechUrl] = useState<string | null>(null);
  const isUser = message.role === 'user';
  const hasError = message.status === 'error';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateSpeech = async () => {
    if (speechUrl) {
      setSpeechUrl(null);
      return;
    }

    setIsGeneratingSpeech(true);
    try {
      const audioBuffer = await openAIService.generateSpeech(message.content);
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setSpeechUrl(url);
    } catch (error) {
      console.error('Failed to generate speech:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const handleDownloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            {attachment.type.startsWith('image/') ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-w-xs max-h-48 rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <div className="text-gray-500">📄</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    {attachment.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadAttachment(attachment)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 p-4 group hover:bg-gray-50/50 transition-colors ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : hasError
          ? 'bg-red-500 text-white'
          : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : hasError ? <AlertCircle size={16} /> : <Bot size={16} />}
      </div>
      
      <div className={`flex-1 max-w-2xl ${isUser ? 'text-right' : ''}`}>
        {/* Audio message */}
        {message.audioUrl && (
          <div className={`mb-2 ${isUser ? 'flex justify-end' : ''}`}>
            <AudioPlayer audioUrl={message.audioUrl} className="max-w-sm" />
          </div>
        )}

        {/* Text message */}
        {message.content && (
          <div className={`inline-block px-4 py-2 rounded-2xl ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : hasError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md shadow-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
          }`}>
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </div>
          </div>
        )}

        {/* Attachments */}
        {renderAttachments()}

        {/* Generated speech */}
        {speechUrl && (
          <div className={`mt-2 ${isUser ? 'flex justify-end' : ''}`}>
            <AudioPlayer audioUrl={speechUrl} className="max-w-sm" />
          </div>
        )}
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : ''}`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.status === 'sending' && (
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
          )}
          {hasError && (
            <span className="text-red-500 text-xs">Failed to send</span>
          )}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
            title="Copy message"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          {!isUser && message.content && (
            <button
              onClick={handleGenerateSpeech}
              disabled={isGeneratingSpeech}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all disabled:opacity-50"
              title={speechUrl ? "Hide speech" : "Generate speech"}
            >
              {isGeneratingSpeech ? (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : speechUrl ? (
                <VolumeX size={12} />
              ) : (
                <Volume2 size={12} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};