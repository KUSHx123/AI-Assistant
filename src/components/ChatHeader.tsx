import React, { useState } from 'react';
import { Bot, MoreVertical, Trash2, Settings, Minimize2, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex-shrink-0 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg hover-lift">
              <Bot size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">AI Assistant</h1>
            <p className="text-sm text-green-600 flex items-center gap-2 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online & Ready
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover-lift btn-animate"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          
          <button
            onClick={onClearChat}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover-lift btn-animate"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
          
          <button 
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover-lift btn-animate"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover-lift btn-animate"
              title="More options"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] z-50 animate-slide-up">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Export Chat
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Preferences
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Help & Support
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};