# CodeGen Studio - Vision 1.0

![CodeGen Studio](https://img.shields.io/badge/CodeGen%20Studio-v0.1.0-blue)
![Privacy First](https://img.shields.io/badge/Privacy-First-green)
![Local AI](https://img.shields.io/badge/AI-Local-orange)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

> **Your code stays yours.** A local-first development environment with AI assistance that never sends your code to the cloud.

## 🚀 Features

- **🔒 Privacy by Design**: Everything runs on your machine
- **🤖 Local AI Assistance**: Code suggestions without internet
- **📁 Project Templates**: Start with production-ready setups
- **⚡ One-Click Operations**: Run, test, build, export
- **🔧 Multi-Language Support**: React, Node.js, Spring Boot, and more
- **🛡️ Security First**: Encrypted storage, network blocking

## 📦 Quick Start

### Prerequisites
- Rust 1.70+
- Node.js 18+
- Java 17 JDK
- Maven 3.8+

### Installation

`ash
# Clone the repository
git clone https://github.com/codegen-studio/codegen-vision1.git
cd codegen-vision1

# Setup environment
make setup

# Download AI models (optional but recommended)
make download-models

# Build the application
make build

# Run in development
make dev
`

### Or download the binary
Download the latest release from [releases page](https://github.com/codegen-studio/codegen-vision1/releases) for your platform.

## 🎯 Usage

1. **Create a new project**: Select from templates (React, Node.js, Spring Boot, etc.)
2. **Write code**: Get AI suggestions as you type
3. **Run & Test**: One-click run and test commands
4. **Export**: Generate clean ZIP files for sharing

## 🔧 Architecture

CodeGen Studio is built with:
- **Frontend**: React + TypeScript + Vite
- **Desktop Shell**: Tauri (Rust)
- **Business Logic**: Java Spring Boot (embedded)
- **AI Engine**: llama.cpp + local models

## 🛡️ Privacy Guarantee

- ✅ No network calls by default
- ✅ All AI processing local
- ✅ Encrypted file storage
- ✅ No telemetry or analytics
- ✅ Your code never leaves your computer

## 📖 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Build Instructions](./docs/BUILD.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Privacy Policy](./docs/PRIVACY.md)
- [API Documentation](./docs/API.md)

## 🏗️ Development

`ash
# Install dependencies
npm install
cd java-backend && mvn install
cd src-tauri && cargo fetch

# Run development servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build
`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) for the amazing desktop framework
- [llama.cpp](https://github.com/ggerganov/llama.cpp) for local AI inference
- [TheBloke](https://huggingface.co/TheBloke) for quantized AI models
- All our early adopters and contributors

## 📞 Support

- [GitHub Issues](https://github.com/codegen-studio/codegen-vision1/issues)
- [Discord Community](https://discord.gg/codegen)
- [Documentation](./docs)

---

**Remember**: Your code is sacred. Keep it local, keep it safe. 🔒
