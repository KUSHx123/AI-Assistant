import React from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isTyping, sendMessage, clearChat, messagesEndRef } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      <ChatHeader onClearChat={clearChat} />
      
      <div className="flex-1 flex flex-col min-h-0 relative">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            <EmptyState />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 px-4">
            <div className="max-w-4xl mx-auto py-4 space-y-1">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className="transform transition-all duration-300 ease-out animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ChatMessage message={message} />
                </div>
              ))}
              {isTyping && (
                <div className="transform transition-all duration-300 ease-out animate-fade-in">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
        )}
        
        {/* Scroll indicator */}
        <div className="absolute bottom-20 right-6 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-500 shadow-lg border border-gray-200">
            {messages.length > 0 && `${messages.length} messages`}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}

export default App;