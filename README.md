# R-PAGER - Clinical Companion

A personalized study assistant for Dr. Raghav Kiran, featuring local AI integration with Ollama and Whisper.cpp.

## 🚀 Local Setup Instructions

### Prerequisites

1. **Install Ollama** (https://ollama.ai)
   ```bash
   # Install Ollama on macOS
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the phi3 model (recommended)
   ollama pull phi3
   
   # Alternative models:
   ollama pull llama3
   ollama pull mixtral
   ```

2. **Install Whisper.cpp** (https://github.com/ggerganov/whisper.cpp)
   ```bash
   # Clone and build whisper.cpp
   git clone https://github.com/ggerganov/whisper.cpp.git
   cd whisper.cpp
   make
   
   # Download a model (base recommended for speed)
   ./models/download-ggml-model.sh base
   
   # Start the server
   ./server -m models/ggml-base.bin --port 8080
   ```

### Running the App

1. **Start Ollama** (runs on localhost:11434 by default)
   ```bash
   ollama serve
   ```

2. **Start Whisper.cpp server** (runs on localhost:8080)
   ```bash
   cd whisper.cpp
   ./server -m models/ggml-base.bin --port 8080
   ```

3. **Start the R-PAGER app**
   ```bash
   npm run dev
   ```

## 🤖 Kai Features

- **Local AI Processing**: All responses generated locally via Ollama
- **Voice Input**: Offline transcription using Whisper.cpp
- **Mood Adaptation**: Responds based on Code Status (Green, Red, Blue, etc.)
- **Medical Context**: Understands medical terminology and study patterns
- **Privacy First**: No data sent to external APIs

## 🎯 Code Status System

- 🟢 **Green**: Stability - Normal study pace
- 🔴 **Red**: Cramming/Pressure - Quick, focused responses
- 🔷 **Blue**: Burnout Risk - Gentle, supportive tone
- 🟣 **Violet**: Emotional Fatigue - Quiet, minimal responses
- 🟡 **Yellow**: Exam Nearby - Direct, prioritized content
- ⚫ **Black**: Fragmented - Simplified, essential responses
- ⚪ **White**: Brain Fog - Soft, low-pressure interactions

## 📱 Usage

1. Click the brain icon to open Kai
2. Type or use voice input to interact
3. Kai adapts to your energy and Code Status
4. Use commands like "summarize", "flashcards", "quiz" for study content

## 🔧 Troubleshooting

- **Kai not responding**: Check if Ollama is running (`ollama serve`)
- **Voice not working**: Ensure Whisper.cpp server is running on port 8080
- **Model errors**: Try pulling a different model (`ollama pull llama3`)

## 🛠️ Development

Built with:
- React + TypeScript
- Tailwind CSS
- Ollama (phi3/llama3/mixtral)
- Whisper.cpp
- Local-first architecture