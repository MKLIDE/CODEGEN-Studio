# Build Instructions

This guide covers building CodeGen Studio from source.

## Prerequisites

### Required Software
1. **Rust** (1.70+) - [Install](https://rustup.rs/)
2. **Node.js** (18+) - [Install](https://nodejs.org/)
3. **Java JDK** (17+) - [Install](https://adoptium.net/)
4. **Maven** (3.8+) - [Install](https://maven.apache.org/)
5. **Git** - [Install](https://git-scm.com/)

### Platform-Specific Requirements

#### Windows
- Visual Studio Build Tools (C++ workload)
- Windows SDK

#### macOS
- Xcode Command Line Tools
- xcode-select --install

#### Linux
- Development tools (gcc, make, etc.)
- libwebkit2gtk-4.0-dev
- libssl-dev

## Quick Build

`ash
# Clone repository
git clone https://github.com/codegen-studio/codegen-vision1.git
cd codegen-vision1

# Run complete build script
./scripts/build-all.sh

# Or use the Makefile
make setup
make build
`

## Detailed Build Steps

### 1. Install Dependencies

`ash
# Frontend dependencies
cd frontend
npm install

# Java backend dependencies
cd ../java-backend
mvn clean install

# Rust dependencies
cd ../src-tauri
cargo fetch
`

### 2. Build Components

#### Frontend
`ash
cd frontend
npm run build
`

#### Java Backend
`ash
cd java-backend
mvn clean package -DskipTests
`

#### Tauri Application
`ash
cd src-tauri
cargo tauri build
`

### 3. Package for Distribution

`ash
cd src-tauri
cargo tauri build --bundles app,dmg,deb,rpm,msi,nsis,appimage
`

## Development Build

`ash
# Run development servers
npm run dev

# Or run Tauri dev directly
cd src-tauri
cargo tauri dev
`

## Testing

`ash
# Run all tests
npm run test

# Run specific test suites
cd frontend && npm test
cd java-backend && mvn test
cd src-tauri && cargo test
`

## Troubleshooting

### Common Issues

#### Rust Build Fails
`ash
# Update Rust
rustup update

# Clean build
cargo clean
`

#### Node.js Dependencies
`ash
# Clean install
rm -rf node_modules package-lock.json
npm install
`

#### Java Build Issues
`ash
# Clean Maven
mvn clean

# Update dependencies
mvn dependency:purge-local-repository
`

### Platform-Specific Issues

#### Windows
- Ensure PowerShell is available
- Run as Administrator if needed
- Check PATH environment variable

#### macOS
- Allow unsigned applications
- Disable Gatekeeper if needed
- Check Xcode installation

#### Linux
- Install missing development packages
- Check library paths
- Use appropriate package manager

## Advanced Build Options

### Build with AI Support
`ash
# Enable AI features
cargo build --features ai
`

### Release Build
`ash
# Optimized release build
cargo tauri build --release
`

### Cross-Compilation
`ash
# Build for different targets
rustup target add x86_64-pc-windows-gnu
rustup target add aarch64-apple-darwin
rustup target add x86_64-unknown-linux-gnu
`

## CI/CD Pipeline

### GitHub Actions
The project includes GitHub Actions workflows for:
- Automated testing
- Release builds
- Deployment

### Docker Build
`ash
# Build Docker image
docker build -t codegen-studio .

# Run in Docker
docker run -it --rm codegen-studio
`

## Distribution

### Binary Distribution
- Windows: .msi, .exe
- macOS: .dmg, .app
- Linux: .deb, .rpm, .AppImage

### Source Distribution
`ash
# Create source archive
git archive --format=zip HEAD -o codegen-studio-source.zip
`

## Further Help

- Check [Architecture Documentation](./ARCHITECTURE.md)
- Read [Developer Guide](./DEVELOPER_GUIDE.md)
- Join [Discord Community](https://discord.gg/codegen)
- Open [GitHub Issues](https://github.com/codegen-studio/codegen-vision1/issues)
