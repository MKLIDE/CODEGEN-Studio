# Default AI Models

This directory contains default AI models for CodeGen Studio.

## Included Models

### 1. Mini Test Model
- **Purpose**: Development and testing
- **Size**: ~10MB (placeholder)
- **Format**: Simulated for testing
- **Languages**: All supported languages

### 2. Example Model Configuration
- **Path**: `./resources/ai-models/`
- **Format**: GGUF (quantized)
- **Recommended**: CodeLlama-7B, StarCoder2-3B

## Usage

1. **Development**: Use the mini test model for quick testing
2. **Production**: Download full models using download script
3. **Custom**: Add your own GGUF models to the ai-models directory

## Download Script

Run the download script to get production models:
```bash
./scripts/download-models.ps1
```

## Model Configuration

Update `config/config.json` to point to your preferred model:
```json
{
  "ai": {
    "modelPath": "./resources/ai-models/codellama-7b-q4.gguf"
  }
}
```

## Testing

For unit tests, use the test model configuration in `.env`:
```
TEST_AI_MODEL_PATH=./resources/ai-models/test-model.gguf
```
