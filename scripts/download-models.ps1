Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Downloading AI Models for CodeGen   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$MODELS_DIR = "./resources/ai-models"
New-Item -ItemType Directory -Force -Path $MODELS_DIR | Out-Null

Write-Host "`n📥 Available models:" -ForegroundColor Yellow
Write-Host "1. CodeLlama-7B (4.8GB) - Good for code completion" -ForegroundColor White
Write-Host "2. StarCoder2-3B (2.1GB) - Fast, good for suggestions" -ForegroundColor White
Write-Host "3. DeepSeek-Coder-1.3B (0.8GB) - Lightweight, efficient" -ForegroundColor White

$choice = Read-Host "`nEnter model number (1-3) or 'a' for all"

function Download-Model {
    param(
        [string]$url,
        [string]$filename,
        [string]$sizeHuman
    )
    
    Write-Host "`n[↓] Downloading $filename ($sizeHuman)..." -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    $outputPath = Join-Path $MODELS_DIR $filename
    
    # Use Invoke-WebRequest for downloading
    try {
        $progressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        $progressPreference = 'Continue'
        
        Write-Host "[✓] Downloaded: $filename" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "[✗] Download failed: $filename" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

switch ($choice) {
    "1" {
        Download-Model `
            -url "https://huggingface.co/TheBloke/CodeLlama-7B-GGUF/resolve/main/codellama-7b.Q4_K_M.gguf" `
            -filename "codellama-7b-q4.gguf" `
            -sizeHuman "4.8GB"
    }
    "2" {
        Download-Model `
            -url "https://huggingface.co/bartowski/StarCoder2-3B-GGUF/resolve/main/starcoder2-3b.Q4_K_M.gguf" `
            -filename "starcoder2-3b-q4.gguf" `
            -sizeHuman "2.1GB"
    }
    "3" {
        Download-Model `
            -url "https://huggingface.co/bartowski/DeepSeek-Coder-1.3B-GGUF/resolve/main/deepseek-coder-1.3b.Q4_K_M.gguf" `
            -filename "deepseek-coder-1.3b-q4.gguf" `
            -sizeHuman "0.8GB"
    }
    { @("a", "A") -contains $_ } {
        Write-Host "[!] This will download ~7.7GB of data" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -in @("y", "Y")) {
            Download-Model `
                -url "https://huggingface.co/TheBloke/CodeLlama-7B-GGUF/resolve/main/codellama-7b.Q4_K_M.gguf" `
                -filename "codellama-7b-q4.gguf" `
                -sizeHuman "4.8GB"
            
            Download-Model `
                -url "https://huggingface.co/bartowski/StarCoder2-3B-GGUF/resolve/main/starcoder2-3b.Q4_K_M.gguf" `
                -filename "starcoder2-3b-q4.gguf" `
                -sizeHuman "2.1GB"
            
            Download-Model `
                -url "https://huggingface.co/bartowski/DeepSeek-Coder-1.3B-GGUF/resolve/main/deepseek-coder-1.3b.Q4_K_M.gguf" `
                -filename "deepseek-coder-1.3b-q4.gguf" `
                -sizeHuman "0.8GB"
        }
    }
    default {
        Write-Host "[✗] Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   [✓] Model download complete!         " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nTo use the models:" -ForegroundColor Yellow
Write-Host "1. Enable AI in settings" -ForegroundColor Gray
Write-Host "2. Select model in AI panel" -ForegroundColor Gray
Write-Host "3. Start getting code suggestions!" -ForegroundColor Gray

Write-Host "`nModels are saved in: $MODELS_DIR" -ForegroundColor Gray
