# Architecture Overview

CodeGen Studio is built with a multi-layer architecture that prioritizes privacy, performance, and developer experience.

## System Architecture

`
┌─────────────────────────────────────────────────────────────┐
│                    CodeGen Studio v0.1.0                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │   Frontend  │  │   Tauri     │  │   Java Backend    │  │
│  │  (React)    │◄─┤   (Rust)    │◄─┤  (Spring Boot)    │  │
│  └─────────────┘  └─────────────┘  └───────────────────┘  │
│         │               │                       │          │
│         └───────────────┼───────────────────────┘          │
│                         │                                  │
│                  ┌──────▼──────┐                          │
│                  │   Local AI  │                          │
│                  │  (llama.cpp)│                          │
│                  └─────────────┘                          │
│                         │                                  │
│                  ┌──────▼──────┐                          │
│                  │  File System │                          │
│                  │  (Encrypted) │                          │
│                  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
`

## Layer 1: Desktop Shell (Tauri + Rust)

**Purpose**: Native desktop application shell, system integration, and privacy controls.

**Components**:
- main.rs - Application entry point and state management
- privacy_guard.rs - Network monitoring and blocking
- ile_vault.rs - Encrypted file operations
- i_engine.rs - Local AI integration via llama.cpp
- java_launcher.rs - Embedded JVM management
- commands.rs - Tauri command handlers for frontend communication

**Key Features**:
- Cross-platform (Windows, macOS, Linux)
- Memory-safe operations
- System tray integration
- Auto-update capabilities
- Native file dialogs

## Layer 2: Business Engine (Java Spring Boot)

**Purpose**: Project generation, template processing, and business logic.

**Components**:
- CodegenApplication.java - Spring Boot entry point
- ProjectService.java - Project generation and management
- TemplateService.java - Template processing and rendering
- AIService.java - AI coordination and response formatting
- FileService.java - File operations and validation

**Key Features**:
- Embedded H2 database for local storage
- REST API for internal communication
- Template engine (Velocity)
- Input validation and sanitization
- Project scaffolding

## Layer 3: User Interface (React + TypeScript)

**Purpose**: Modern, responsive user interface with real-time updates.

**Components**:
- App.tsx - Main application component
- CodeEditor.tsx - Monaco editor integration
- Sidebar.tsx - File explorer and project navigation
- AIPanel.tsx - AI assistant interface
- ProjectPanel.tsx - Project management

**Key Features**:
- Monaco Editor (same as VS Code)
- Real-time AI suggestions
- Drag-and-drop file management
- Theme support (light/dark)
- Responsive design

## Layer 4: Local AI Integration

**Purpose**: Privacy-preserving AI assistance without cloud dependencies.

**Components**:
- llama_bridge.rs - llama.cpp integration
- model_manager.rs - AI model management
- Local model storage and caching

**Key Features**:
- 100% local processing
- Support for GGUF model format
- Context-aware code completion
- Multiple model support
- Memory-efficient inference

## Data Flow

1. **User Action** → Frontend captures user input
2. **Tauri Command** → Frontend calls Rust command via Tauri
3. **Business Logic** → Rust delegates to Java backend if needed
4. **AI Processing** → llama.cpp generates suggestions
5. **File Operations** → Encrypted read/write operations
6. **Response** → Results flow back through layers to UI

## Privacy Architecture

### Network Security
- All outgoing connections blocked by default
- Localhost-only API communication
- No telemetry or analytics
- Encrypted local storage

### Data Protection
- AES-256 encryption for sensitive data
- Memory-safe operations (Rust)
- Secure key storage
- Local-only AI processing

### Audit Trail
- Local logging (no remote transmission)
- Privacy dashboard for monitoring
- Configurable privacy settings

## Development Architecture

### Build System
- Turborepo for task orchestration
- Maven for Java builds
- Cargo for Rust builds
- Vite for frontend builds

### Testing
- Rust unit tests
- Java Spring Boot tests
- React component tests
- Integration tests

### Deployment
- Single binary distribution
- Embedded JVM and resources
- No external dependencies required
- Cross-platform packaging

## Scalability Considerations

### Current (Vision 1)
- Single-user, local-first
- Basic AI with small models
- Essential templates
- Core privacy features

### Future (Vision 2+)
- Team collaboration
- Advanced AI models
- Template marketplace
- Plugin ecosystem
- Cloud sync (opt-in)

## Technology Stack

### Core
- **Rust**: System programming, memory safety
- **Java**: Business logic, template processing
- **TypeScript**: Frontend development
- **React**: User interface

### Frameworks
- **Tauri**: Desktop application framework
- **Spring Boot**: Java application framework
- **Vite**: Frontend build tool

### AI/ML
- **llama.cpp**: Local AI inference
- **CodeLlama**: Code generation models

### Database
- **H2**: Embedded database
- **SQLite**: Local data storage

## Performance Targets

- **Startup Time**: < 3 seconds
- **AI Response**: < 4 seconds
- **Memory Usage**: < 500MB
- **Binary Size**: < 100MB
- **Project Generation**: < 10 seconds

## Security Considerations

- All code auditable (open source components)
- Regular dependency updates
- Security vulnerability scanning
- Penetration testing
- Compliance with privacy regulations

## Contributing to Architecture

When extending the architecture:

1. Maintain privacy-first principle
2. Keep dependencies minimal
3. Ensure cross-platform compatibility
4. Write comprehensive tests
5. Document architecture decisions

## Further Reading

- [Build Instructions](./BUILD.md)
- [Privacy Documentation](./PRIVACY.md)
- [API Documentation](./API.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
