import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, Attachment } from '../types/chat';
import { openAIService, ChatMessage } from '../services/openai';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[], audioBlob?: Blob) => {
    let messageContent = content;
    let audioUrl: string | undefined;

    // Handle audio transcription
    if (audioBlob) {
      try {
        setIsTyping(true);
        const transcription = await openAIService.transcribeAudio(audioBlob);
        messageContent = transcription;
        audioUrl = URL.createObjectURL(audioBlob);
      } catch (error) {
        console.error('Audio transcription failed:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: 'Failed to transcribe audio. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
      status: 'sent',
      attachments,
      audioUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Check if OpenAI is configured
      if (!openAIService.isConfigured()) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'OpenAI API key is not configured. Please add your API key to the .env file.',
          role: 'assistant',
          timestamp: new Date(),
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        return;
      }

      // Convert messages to OpenAI format
      const chatMessages: ChatMessage[] = [];
      
      for (const msg of messages) {
        if (msg.role === 'user') {
          // Handle messages with image attachments
          const imageAttachments = msg.attachments?.filter(att => att.type.startsWith('image/')) || [];
          
          if (imageAttachments.length > 0) {
            const content = [
              { type: 'text' as const, text: msg.content }
            ];
            
            imageAttachments.forEach(img => {
              content.push({
                type: 'image_url' as const,
                image_url: { url: img.url }
              });
            });
            
            chatMessages.push({
              role: msg.role,
              content
            });
          } else {
            // Include text file content if available
            let textContent = msg.content;
            const textAttachments = msg.attachments?.filter(att => att.content) || [];
            
            if (textAttachments.length > 0) {
              textContent += '\n\nAttached files:\n';
              textAttachments.forEach(att => {
                textContent += `\n--- ${att.name} ---\n${att.content}\n`;
              });
            }
            
            chatMessages.push({
              role: msg.role,
              content: textContent
            });
          }
        } else {
          chatMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }

      // Add the current user message
      const imageAttachments = attachments?.filter(att => att.type.startsWith('image/')) || [];
      
      if (imageAttachments.length > 0) {
        const content = [
          { type: 'text' as const, text: messageContent }
        ];
        
        imageAttachments.forEach(img => {
          content.push({
            type: 'image_url' as const,
            image_url: { url: img.url }
          });
        });
        
        chatMessages.push({
          role: 'user',
          content
        });
      } else {
        // Include text file content if available
        let textContent = messageContent;
        const textAttachments = attachments?.filter(att => att.content) || [];
        
        if (textAttachments.length > 0) {
          textContent += '\n\nAttached files:\n';
          textAttachments.forEach(att => {
            textContent += `\n--- ${att.name} ---\n${att.content}\n`;
          });
        }
        
        chatMessages.push({
          role: 'user',
          content: textContent
        });
      }

      // Get AI response
      const aiResponse = await openAIService.generateResponse(chatMessages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    messagesEndRef
  };
};