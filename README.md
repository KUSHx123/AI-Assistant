# AI Assistant - Intelligent Chat Interface

A modern, feature-rich AI chatbot application built with React, TypeScript, and OpenAI's GPT models. This application provides a seamless chat experience with voice recording, file uploads, image analysis, and subscription-based pricing tiers.

![AI Assistant](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🤖 AI Capabilities
- **Real-time Chat** - Powered by OpenAI's GPT models
- **Voice Messages** - Record and transcribe voice messages
- **Text-to-Speech** - Generate audio from AI responses
- **File Analysis** - Upload and analyze documents, images, and text files
- **Image Understanding** - AI can analyze and describe uploaded images
- **Context Awareness** - Maintains conversation history for better responses

### 🎨 User Interface
- **Modern Design** - Beautiful, responsive interface with smooth animations
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Custom Scrollbars** - Elegant scrolling experience
- **Mobile Responsive** - Optimized for all screen sizes
- **Dark/Light Themes** - Adaptive color schemes
- **Accessibility** - WCAG compliant with keyboard navigation

### 💳 Subscription Plans
- **Free Tier** - 50 messages per month
- **Plus Plan** - 1,000 messages, advanced features ($19/month)
- **Pro Plan** - Unlimited messages, premium features ($49/month)
- **Payment Integration** - Secure payment processing with Stripe

### 🔧 Technical Features
- **TypeScript** - Full type safety and better development experience
- **React Router** - Seamless navigation between pages
- **Custom Hooks** - Reusable logic for chat, audio, and file handling
- **Error Handling** - Comprehensive error management and user feedback
- **Performance Optimized** - Efficient rendering and memory management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Modern web browser with HTTPS support (for voice features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-4o-mini
   VITE_SYSTEM_PROMPT=You are a helpful AI assistant...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | - | ✅ |
| `VITE_OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` | ❌ |
| `VITE_SYSTEM_PROMPT` | Custom system prompt | Default helpful assistant | ❌ |

### Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your `.env` file

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AudioPlayer.tsx     # Audio playback component
│   ├── AudioRecorder.tsx   # Voice recording component
│   ├── ChatHeader.tsx      # Chat interface header
│   ├── ChatInput.tsx       # Message input component
│   ├── ChatMessage.tsx     # Individual message display
│   ├── EmptyState.tsx      # Empty chat state
│   ├── FileUpload.tsx      # File upload handling
│   ├── Navigation.tsx      # App navigation
│   ├── PaymentModal.tsx    # Payment processing modal
│   └── TypingIndicator.tsx # AI typing animation
├── hooks/               # Custom React hooks
│   ├── useAudioRecorder.ts # Audio recording logic
│   ├── useChat.ts          # Chat state management
│   └── useFileHandler.ts   # File processing logic
├── pages/               # Application pages
│   ├── ChatPage.tsx        # Main chat interface
│   └── PricingPage.tsx     # Subscription pricing
├── services/            # External service integrations
│   └── openai.ts           # OpenAI API integration
├── types/               # TypeScript type definitions
│   └── chat.ts             # Chat-related types
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and animations
```

## 🎯 Usage Guide

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI response
4. Continue the conversation naturally

### Voice Messages
1. Click the microphone icon
2. Allow microphone permissions
3. Speak your message
4. Click stop to send the transcribed message

### File Uploads
1. Click the paperclip icon
2. Select files (images, documents, text files)
3. Files will be analyzed and included in your message
4. AI can answer questions about the uploaded content

### Text-to-Speech
1. Hover over any AI message
2. Click the speaker icon
3. Listen to the generated audio
4. Control playback with the audio player

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### Deployment

This application can be deployed to any static hosting service:

- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop `dist/` folder
- **GitHub Pages** - Push `dist/` to `gh-pages` branch
- **AWS S3** - Upload `dist/` contents to S3 bucket

## 🔒 Security Considerations

### API Key Security
- **Never commit** API keys to version control
- **Use environment variables** for all sensitive data
- **Consider backend proxy** for production to hide API keys
- **Implement rate limiting** to prevent abuse

### Production Recommendations
1. **Move API calls to backend** - Keep API keys server-side
2. **Implement authentication** - User accounts and session management
3. **Add rate limiting** - Prevent API abuse
4. **Use HTTPS** - Required for voice features
5. **Content filtering** - Implement content moderation

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize color schemes and animations

### AI Behavior
- Modify `VITE_SYSTEM_PROMPT` in `.env`
- Adjust model parameters in `src/services/openai.ts`
- Customize response handling and formatting

### Features
- Add new message types in `src/types/chat.ts`
- Extend file handling in `src/hooks/useFileHandler.ts`
- Implement new UI components in `src/components/`

## 🐛 Troubleshooting

### Common Issues

**Voice recording not working:**
- Ensure you're using HTTPS (required for microphone access)
- Check browser permissions for microphone
- Try refreshing the page and allowing permissions again

**API errors:**
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure the model name is valid (e.g., `gpt-4o-mini`)

**File upload issues:**
- Check file size (max 10MB)
- Verify file type is supported
- Ensure stable internet connection

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version (18+ required)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support for urgent issues

## 🙏 Acknowledgments

- **OpenAI** - For providing the GPT models and APIs
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icon library
- **Vite** - For the fast build tool and development server

---

**Built with ❤️ using React, TypeScript, and OpenAI**