# CodeGen Studio Resources

This directory contains all the resources needed for CodeGen Studio to function.

## Structure

### AI Models (esources/ai-models/)
Contains local AI models for code generation and suggestions.
- Format: GGUF (quantized for efficiency)
- Models: CodeLlama, StarCoder, DeepSeek-Coder
- Size: 0.8GB - 4.8GB per model

### JVM (esources/jvm/)
Embedded Java Virtual Machine for running the backend.
- Platform-specific binaries
- Zulu JDK 17 (OpenJDK distribution)

### Binaries (esources/binaries/)
Platform-specific native binaries.
- llama.cpp executables for AI inference
- Native libraries for performance

### Licenses (esources/licenses/)
Open source licenses for all dependencies.

## Adding Resources

### AI Models
1. Download GGUF models from Hugging Face
2. Place in esources/ai-models/
3. Update model-manifest.json

### JVM
1. Download Zulu JDK 17 for each platform
2. Extract to platform-specific directories
3. Ensure java executable is in PATH

### Binaries
1. Build or download platform-specific binaries
2. Place in appropriate platform directory
3. Update PATH in configuration

## Privacy Note

All resources are stored locally. No network access is required after initial setup.
