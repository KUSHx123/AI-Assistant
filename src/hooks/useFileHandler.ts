import { useCallback } from 'react';
import { Attachment } from '../types/chat';

export const useFileHandler = () => {
  const processFile = useCallback(async (file: File): Promise<Attachment> => {
    const attachment: Attachment = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    };

    // Extract text content for text files
    if (file.type.startsWith('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv')) {
      try {
        const text = await file.text();
        attachment.content = text;
      } catch (error) {
        console.error('Error reading text file:', error);
      }
    }

    return attachment;
  }, []);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/',
      'image/',
      'application/pdf',
      'application/json',
      'application/csv',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowedType) {
      return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
  }, []);

  const handleFileSelect = useCallback(async (files: FileList): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        throw new Error(`${file.name}: ${validation.error}`);
      }
      
      const attachment = await processFile(file);
      attachments.push(attachment);
    }
    
    return attachments;
  }, [processFile, validateFile]);

  return {
    handleFileSelect,
    validateFile,
    processFile
  };
};