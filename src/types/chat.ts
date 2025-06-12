export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Attachment[];
  audioUrl?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string; // For text files or extracted content
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
}

export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
}