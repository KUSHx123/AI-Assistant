import React, { useState } from 'react';
import { Bot, User, Copy, Check, AlertCircle, Download, Volume2, VolumeX, Heart, Share } from 'lucide-react';
import { Message } from '../types/chat';
import { AudioPlayer } from './AudioPlayer';
import { openAIService } from '../services/openai';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [speechUrl, setSpeechUrl] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
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
      <div className="mt-3 space-y-2">
        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="group">
            {attachment.type.startsWith('image/') ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="max-w-xs max-h-64 rounded-xl object-cover shadow-md hover:shadow-lg transition-shadow duration-200 hover-lift"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-xl" />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover-lift">
                <div className="text-blue-500 bg-blue-100 p-2 rounded-lg">📄</div>
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
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 btn-animate"
                  title="Download"
                >
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`group relative py-4 px-2 hover:bg-gray-50/50 rounded-xl transition-all duration-200 ${isUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover-lift transition-all duration-200 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : hasError
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
            : 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white'
        }`}>
          {isUser ? <User size={18} /> : hasError ? <AlertCircle size={18} /> : <Bot size={18} />}
        </div>
        
        <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
          {/* Audio message */}
          {message.audioUrl && (
            <div className={`mb-3 ${isUser ? 'flex justify-end' : ''}`}>
              <div className="animate-fade-in">
                <AudioPlayer audioUrl={message.audioUrl} className="max-w-sm" />
              </div>
            </div>
          )}

          {/* Text message */}
          {message.content && (
            <div className={`inline-block px-5 py-3 rounded-2xl message-bubble shadow-sm ${
              isUser 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md max-w-lg' 
                : hasError
                ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md shadow-sm max-w-2xl'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm max-w-2xl hover:shadow-md'
            }`}>
              <div className="whitespace-pre-wrap break-words leading-relaxed text-sm">
                {message.content}
              </div>
            </div>
          )}

          {/* Attachments */}
          {renderAttachments()}

          {/* Generated speech */}
          {speechUrl && (
            <div className={`mt-3 animate-fade-in ${isUser ? 'flex justify-end' : ''}`}>
              <AudioPlayer audioUrl={speechUrl} className="max-w-sm" />
            </div>
          )}
          
          {/* Message actions */}
          <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${isUser ? 'justify-end' : ''}`}>
            <span className="font-medium">{formatTime(message.timestamp)}</span>
            {message.status === 'sending' && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-500">Sending...</span>
              </div>
            )}
            {hasError && (
              <span className="text-red-500 text-xs font-medium">Failed to send</span>
            )}
            
            {/* Action buttons */}
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200 btn-animate"
                title="Copy message"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              
              {!isUser && (
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200 btn-animate ${liked ? 'text-red-500' : ''}`}
                  title="Like message"
                >
                  <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                </button>
              )}
              
              <button
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200 btn-animate"
                title="Share message"
              >
                <Share size={14} />
              </button>
              
              {!isUser && message.content && (
                <button
                  onClick={handleGenerateSpeech}
                  disabled={isGeneratingSpeech}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200 disabled:opacity-50 btn-animate"
                  title={speechUrl ? "Hide speech" : "Generate speech"}
                >
                  {isGeneratingSpeech ? (
                    <div className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : speechUrl ? (
                    <VolumeX size={14} />
                  ) : (
                    <Volume2 size={14} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};