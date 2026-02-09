# CodeGen Studio Build Script - PowerShell Version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Building CodeGen Studio v0.1.0      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

function Write-Success($message) {
    Write-Host "[✓] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[!] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[✗] $message" -ForegroundColor Red
}

# Check prerequisites
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Yellow

function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        Write-Success "$command installed"
        return $true
    } catch {
        Write-Error "$command not found"
        return $false
    }
}

# Check all required commands
$commandsOk = $true
$commandsOk = Test-Command "node" -and $commandsOk
$commandsOk = Test-Command "npm" -and $commandsOk
$commandsOk = Test-Command "rustc" -and $commandsOk
$commandsOk = Test-Command "cargo" -and $commandsOk
$commandsOk = Test-Command "java" -and $commandsOk
$commandsOk = Test-Command "mvn" -and $commandsOk

if (-not $commandsOk) {
    Write-Error "Some prerequisites are missing. Please install them first."
    pause
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow

# Frontend
Write-Success "Installing frontend dependencies..."
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend dependencies failed"
    pause
    exit 1
}
Set-Location ..

# Java backend
Write-Success "Installing Java dependencies..."
Set-Location java-backend
mvn clean install
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Java dependencies failed, continuing without Java..."
}
Set-Location ..

# Rust dependencies
Write-Success "Installing Rust dependencies..."
Set-Location src-tauri
cargo fetch
if ($LASTEXITCODE -ne 0) {
    Write-Error "Rust dependencies failed"
    pause
    exit 1
}
Set-Location ..

# Build everything
Write-Host "`n🔨 Building components..." -ForegroundColor Yellow

# Build frontend
Write-Success "Building frontend..."
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed"
    pause
    exit 1
}
Set-Location ..

# Build Java JAR
Write-Success "Building Java backend..."
Set-Location java-backend
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Java build failed, continuing without Java backend..."
} else {
    # Copy JAR to Tauri resources
    Copy-Item -Path "target/*.jar" -Destination "../src-tauri/src/" -ErrorAction SilentlyContinue
}
Set-Location ..

# Copy resources
Write-Success "Copying resources..."
New-Item -ItemType Directory -Force -Path "src-tauri/target/resources" | Out-Null
Copy-Item -Path "resources/*" -Destination "src-tauri/target/resources/" -Recurse -ErrorAction SilentlyContinue

# Build Tauri application
Write-Success "Building Tauri application..."
Set-Location src-tauri
cargo tauri build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Tauri build failed"
    pause
    exit 1
}
Set-Location ..

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   🎉 BUILD COMPLETED SUCCESSFULLY!      " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n📁 Build output:" -ForegroundColor Yellow
Write-Host "• Frontend: ./frontend/dist/" -ForegroundColor Gray
Write-Host "• Java JAR: ./java-backend/target/codegen-backend.jar" -ForegroundColor Gray
Write-Host "• Tauri App: ./src-tauri/target/release/codegen-studio" -ForegroundColor Gray

Write-Host "`n🚀 To run the application:" -ForegroundColor Yellow
Write-Host "1. Development: npm run dev" -ForegroundColor Gray
Write-Host "2. Production: ./src-tauri/target/release/codegen-studio" -ForegroundColor Gray

Write-Host "`n📦 To package for distribution:" -ForegroundColor Yellow
Write-Host "npm run package" -ForegroundColor Gray
