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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ChatHeader onClearChat={clearChat} />
      
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

export default App;