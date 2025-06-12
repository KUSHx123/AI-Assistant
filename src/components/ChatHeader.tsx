import React from 'react';
import { Bot, MoreVertical, Trash2, Settings } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  return (
    <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-green-500 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onClearChat}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};