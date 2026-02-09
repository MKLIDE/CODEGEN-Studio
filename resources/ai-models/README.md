# AI Models for CodeGen Studio

This directory contains AI models for local code generation and suggestions.

## Supported Models

### CodeLlama-7B
- Size: 4.8GB (Q4_K_M quantization)
- Best for: Code completion, multi-language support
- Languages: JavaScript, TypeScript, Python, Java, Rust, Go, C++

### StarCoder2-3B
- Size: 2.1GB (Q4_K_M quantization)
- Best for: Fast suggestions, Python-focused
- Languages: Python, JavaScript, Java, Go, Rust

## Downloading Models

Run the download script:
```bash
./scripts/download-models.ps1
```

Or download manually from Hugging Face and place GGUF files here.

## Model Format

All models use GGUF format (GGML Universal Format) for efficient CPU inference.

## Performance Tips

1. Use Q4_K_M quantization for best speed/size ratio
2. Allocate at least 8GB RAM for 7B models
3. Adjust thread count in settings for your CPU

## Privacy Note

Models run 100% locally. No data is sent to external servers.
