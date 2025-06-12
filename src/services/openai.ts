import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export class OpenAIService {
  private model: string;
  private systemPrompt: string;

  constructor() {
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    this.systemPrompt = import.meta.env.VITE_SYSTEM_PROMPT || 
      'You are a helpful AI assistant. Be concise, friendly, and informative in your responses. You can analyze images, process documents, and help with various tasks.';
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Add system message if not already present
      const messagesWithSystem = messages[0]?.role === 'system' 
        ? messages 
        : [{ role: 'system' as const, content: this.systemPrompt }, ...messages];

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: messagesWithSystem,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return 'Please configure your OpenAI API key in the environment variables.';
        }
        if (error.message.includes('quota')) {
          return 'OpenAI API quota exceeded. Please check your usage limits.';
        }
        if (error.message.includes('rate limit')) {
          return 'Rate limit exceeded. Please wait a moment before sending another message.';
        }
      }
      
      return 'I encountered an error while processing your request. Please try again.';
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await openai.audio.transcriptions.create({
        file: audioBlob,
        model: 'whisper-1',
      });

      return response.text;
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  async generateSpeech(text: string): Promise<ArrayBuffer> {
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Speech generation error:', error);
      throw new Error('Failed to generate speech. Please try again.');
    }
  }

  async analyzeImage(imageUrl: string, prompt: string = "What's in this image?"): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'I was unable to analyze this image.';
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  isConfigured(): boolean {
    return !!import.meta.env.VITE_OPENAI_API_KEY;
  }
}

export const openAIService = new OpenAIService();