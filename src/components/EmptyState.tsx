import React from 'react';
import { Bot, MessageCircle, Zap, Brain, AlertTriangle, Upload, Mic, Image, Sparkles } from 'lucide-react';
import { openAIService } from '../services/openai';

export const EmptyState: React.FC = () => {
  const isConfigured = openAIService.isConfigured();

  const suggestions = [
    {
      icon: <MessageCircle size={20} />,
      title: "Ask me anything",
      description: "I can help with questions, explanations, and creative tasks",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain size={20} />,
      title: "Problem solving",
      description: "Get help with coding, math, or complex problems",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap size={20} />,
      title: "Creative writing",
      description: "Stories, poems, articles, or any creative content",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Upload size={20} />,
      title: "File analysis",
      description: "Upload documents, images, or text files for analysis",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Image size={20} />,
      title: "Image understanding",
      description: "Upload images and ask questions about them",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Mic size={20} />,
      title: "Voice messages",
      description: "Record voice messages for hands-free interaction",
      gradient: "from-red-500 to-pink-500"
    }
  ];

  if (!isConfigured) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center mb-8 shadow-lg animate-pulse">
          <AlertTriangle size={40} />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          OpenAI API Key Required
        </h2>
        <div className="text-gray-600 mb-8 max-w-lg space-y-6">
          <p className="text-lg">To use this AI chatbot, you need to configure your OpenAI API key.</p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl text-left text-sm border border-gray-200 shadow-sm">
            <p className="font-semibold mb-3 text-gray-800">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-medium">OpenAI Platform</a></li>
              <li>Create a <code className="bg-gray-200 px-2 py-1 rounded font-mono text-xs">.env</code> file in your project root</li>
              <li>Add: <code className="bg-gray-200 px-2 py-1 rounded font-mono text-xs">VITE_OPENAI_API_KEY=your_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xl hover-lift">
          <Bot size={40} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles size={16} className="text-white" />
        </div>
      </div>
      
      <h2 className="text-4xl font-bold text-gray-900 mb-3">
        Welcome to AI Assistant
      </h2>
      <p className="text-gray-600 mb-12 max-w-2xl text-lg leading-relaxed">
        I'm powered by OpenAI and ready to help you with questions, creative tasks, problem-solving, and more. 
        I can also analyze files, understand images, and respond to voice messages!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="group p-6 border border-gray-200 rounded-2xl hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 hover-lift animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${suggestion.gradient} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {suggestion.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">{suggestion.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{suggestion.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        <p>Start a conversation by typing a message, uploading a file, or recording your voice!</p>
      </div>
    </div>
  );
};