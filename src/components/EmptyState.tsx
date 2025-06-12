import React from 'react';
import { Bot, MessageCircle, Zap, Brain, AlertTriangle, Upload, Mic, Image } from 'lucide-react';
import { openAIService } from '../services/openai';

export const EmptyState: React.FC = () => {
  const isConfigured = openAIService.isConfigured();

  const suggestions = [
    {
      icon: <MessageCircle size={16} />,
      title: "Ask me anything",
      description: "I can help with questions, explanations, and creative tasks"
    },
    {
      icon: <Brain size={16} />,
      title: "Problem solving",
      description: "Get help with coding, math, or complex problems"
    },
    {
      icon: <Zap size={16} />,
      title: "Creative writing",
      description: "Stories, poems, articles, or any creative content"
    },
    {
      icon: <Upload size={16} />,
      title: "File analysis",
      description: "Upload documents, images, or text files for analysis"
    },
    {
      icon: <Image size={16} />,
      title: "Image understanding",
      description: "Upload images and ask questions about them"
    },
    {
      icon: <Mic size={16} />,
      title: "Voice messages",
      description: "Record voice messages for hands-free interaction"
    }
  ];

  if (!isConfigured) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          OpenAI API Key Required
        </h2>
        <div className="text-gray-600 mb-8 max-w-md space-y-4">
          <p>To use this AI chatbot, you need to configure your OpenAI API key.</p>
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm">
            <p className="font-medium mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in your project root</li>
              <li>Add: <code className="bg-gray-200 px-1 rounded">VITE_OPENAI_API_KEY=your_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center mb-6">
        <Bot size={32} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to AI Assistant
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        I'm powered by OpenAI and ready to help you with questions, creative tasks, problem-solving, and more. 
        I can also analyze files, understand images, and respond to voice messages!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="text-blue-500 mb-2 group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{suggestion.title}</h3>
            <p className="text-sm text-gray-600">{suggestion.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};