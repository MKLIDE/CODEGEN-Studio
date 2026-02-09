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

# Function to install Rust automatically
function Install-Rust {
    Write-Host "`n🦀 Rust not found. Installing Rust automatically..." -ForegroundColor Yellow
    
    try {
        # Download and run rustup installer
        Write-Host "Downloading rustup installer..." -ForegroundColor Gray
        $rustupUrl = "https://win.rustup.rs/x86_64"
        $rustupPath = "$env:TEMP\rustup-init.exe"
        
        # Download the installer
        Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupPath -UseBasicParsing
        
        # Run the installer silently with default options
        Write-Host "Installing Rust (this may take a few minutes)..." -ForegroundColor Gray
        Start-Process -FilePath $rustupPath -ArgumentList "-y" -Wait -NoNewWindow
        
        # Update PATH for current session
        $cargoPath = "$env:USERPROFILE\.cargo\bin"
        $env:Path += ";$cargoPath"
        
        # Verify installation
        Start-Sleep -Seconds 2
        $rustcCheck = Get-Command rustc -ErrorAction SilentlyContinue
        $cargoCheck = Get-Command cargo -ErrorAction SilentlyContinue
        
        if ($rustcCheck -and $cargoCheck) {
            $rustVersion = rustc --version 2>&1
            $cargoVersion = cargo --version 2>&1
            Write-Success "Rust installed successfully!"
            Write-Success "Rust compiler: $($rustVersion -replace 'rustc ', '')"
            Write-Success "Cargo package manager: $($cargoVersion -replace 'cargo ', '')"
            return $true
        } else {
            Write-Error "Rust installation may have completed but needs a shell restart."
            Write-Host "Please restart your terminal and run this script again." -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Error "Failed to install Rust automatically: $_"
        Write-Host "Please install Rust manually from: https://rustup.rs/" -ForegroundColor Yellow
        Write-Host "Or run: winget install Rustlang.Rustup" -ForegroundColor Gray
        return $false
    }
}

# Check prerequisites
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Yellow

function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        Write-Success "$command installed"
        return $true
    } catch {
        Write-Warning "$command not found"
        return $false
    }
}

# Check all required commands
$commandsOk = $true
$commandsOk = Test-Command "node" -and $commandsOk
$commandsOk = Test-Command "npm" -and $commandsOk

# Check Rust and auto-install if missing
$rustOk = Test-Command "rustc"
if (-not $rustOk) {
    Write-Host "`n⚠️  Rust is required for Tauri backend." -ForegroundColor Yellow
    $installChoice = Read-Host "Do you want to install Rust automatically now? (y/n)"
    
    if ($installChoice -in @("y", "Y", "yes", "Yes")) {
        $rustOk = Install-Rust
        if (-not $rustOk) {
            Write-Error "Rust installation failed or incomplete. Build cannot continue."
            pause
            exit 1
        }
    } else {
        Write-Error "Rust is required to build CodeGen Studio."
        Write-Host "Please install Rust manually and run this script again." -ForegroundColor Yellow
        Write-Host "Install from: https://rustup.rs/" -ForegroundColor Gray
        pause
        exit 1
    }
}

# Rust dependencies should be okay now, check cargo too
$cargoOk = Test-Command "cargo"

# Make Java and Maven optional for now
$javaOk = Test-Command "java"
$mavenOk = Test-Command "mvn"

if (-not $javaOk) {
    Write-Warning "Java not found. Java backend will be disabled."
}

if (-not $mavenOk) {
    Write-Warning "Maven not found. Java backend will be disabled."
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

# Java backend (only if Java and Maven are available)
if ($javaOk -and $mavenOk) {
    Write-Success "Installing Java dependencies..."
    Set-Location java-backend
    mvn clean install
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Java dependencies failed, continuing without Java..."
    }
    Set-Location ..
} else {
    Write-Warning "Skipping Java backend setup (Java or Maven not found)"
}

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

# Build Java JAR (only if available)
if ($javaOk -and $mavenOk) {
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
}

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
if ($javaOk -and $mavenOk) {
    Write-Host "• Java JAR: ./java-backend/target/codegen-backend.jar" -ForegroundColor Gray
}
Write-Host "• Tauri App: ./src-tauri/target/release/codegen-studio" -ForegroundColor Gray

Write-Host "`n🚀 To run the application:" -ForegroundColor Yellow
Write-Host "1. Development: npm run dev" -ForegroundColor Gray
Write-Host "2. Production: ./src-tauri/target/release/codegen-studio" -ForegroundColor Gray

Write-Host "`n📦 To package for distribution:" -ForegroundColor Yellow
Write-Host "npm run package" -ForegroundColor Gray

pause