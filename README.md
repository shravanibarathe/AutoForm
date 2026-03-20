# VoiceRecruit AI (React + Vite)

A production-ready, voice-powered recruitment application that uses **intelligent regex-based pattern matching** for data extraction, completely eliminating the need for external LLM APIs.

## 🚀 Key Features
- **🎙️ Browser-Native Voice**: Uses the Web Speech API for high-performance, cost-free transcription.
- **🧠 Pattern Matching Engine**: A custom-built `extractorService.js` that uses advanced regex to capture Name, Email, Phone, Experience, Skills, and more.
- **⚡ Guided Conversation**: Rule-based flow that asks for missing information and acknowledges updates.
- **✨ Framer Motion UI**: Smooth transitions, rhythmic pulsing mic, and glassmorphism panels.
- **🔄 Sync & Status**: Real-time WebSocket connectivity status and LocalStorage resilience.

## 🛠️ Technology Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice**: Web Speech API

## 📁 System Architecture
- `src/services/extractorService.js`: The "brain" of the app. It processes transcripts against a library of regex patterns.
- `src/hooks/useVoiceRecognition.js`: Manages the complex state transitions of the Speech API.
- `src/hooks/useConversationFlow.js`: Controls the "assistant" persona's questionnaire logic.

## 📦 Getting Started
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173`
4. Click the **Indigo Microphone** and start talking!

*Example:* "Hi, I'm Alex. My email is alex@dev.com. I have 7 years of React experience."
