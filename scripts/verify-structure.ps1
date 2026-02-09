# verification.ps1
# Verifies all required files are present

Write-Host "🔍 Verifying CodeGen Studio Structure..." -ForegroundColor Cyan

$requiredFiles = @(
    # Root files
    "Cargo.toml",
    "package.json",
    "turbo.json",
    "Makefile",
    ".gitignore",
    ".env",
    ".env.example",
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "ROADMAP.md",
    
    # Config
    "config/config.json",
    "config/default.json",
    
    # Tauri
    "src-tauri/Cargo.toml",
    "src-tauri/tauri.conf.json",
    "src-tauri/build.rs",
    "src-tauri/src/main.rs",
    "src-tauri/src/commands.rs",
    "src-tauri/src/models.rs",
    "src-tauri/src/llama_bridge.rs",
    "src-tauri/src/java_launcher.rs",
    "src-tauri/src/privacy_guard.rs",
    "src-tauri/src/file_vault.rs",
    "src-tauri/src/ai_engine.rs",
    "src-tauri/src/model_manager.rs",
    "src-tauri/src/encryption.rs",
    "src-tauri/src/template_processor.rs",
    "src-tauri/src/utils.rs",
    
    # Java Backend
    "java-backend/pom.xml",
    "java-backend/src/main/java/com/codegen/CodegenApplication.java",
    "java-backend/src/main/java/com/codegen/config/AppConfig.java",
    "java-backend/src/main/java/com/codegen/config/WebConfig.java",
    "java-backend/src/main/java/com/codegen/model/Project.java",
    "java-backend/src/main/java/com/codegen/model/Template.java",
    "java-backend/src/main/java/com/codegen/repository/ProjectRepository.java",
    "java-backend/src/main/java/com/codegen/repository/TemplateRepository.java",
    "java-backend/src/main/java/com/codegen/service/ProjectService.java",
    "java-backend/src/main/java/com/codegen/controller/ProjectController.java",
    "java-backend/src/main/java/com/codegen/engine/TemplateEngine.java",
    "java-backend/src/main/java/com/codegen/engine/AIEngine.java",
    "java-backend/src/main/java/com/codegen/util/FileUtils.java",
    "java-backend/src/main/java/com/codegen/util/ValidationUtils.java",
    "java-backend/src/main/java/com/codegen/integration/AIIntegrationService.java",
    "java-backend/src/main/java/com/codegen/integration/FileSystemIntegration.java",
    
    # Frontend
    "frontend/package.json",
    "frontend/vite.config.ts",
    "frontend/tsconfig.json",
    "frontend/tsconfig.node.json",
    "frontend/tailwind.config.js",
    "frontend/postcss.config.js",
    "frontend/src/main.tsx",
    "frontend/src/App.tsx",
    "frontend/src/index.css",
    "frontend/src/types/index.ts",
    "frontend/src/stores/app-store.ts",
    "frontend/src/lib/api/client.ts",
    "frontend/src/lib/utils.ts",
    "frontend/src/lib/constants.ts",
    "frontend/src/components/layout/Sidebar.tsx",
    "frontend/src/components/layout/Header.tsx",
    "frontend/src/components/editor/CodeEditor.tsx",
    "frontend/src/components/panels/AIPanel.tsx",
    "frontend/src/hooks/useAI.ts",
    "frontend/src/hooks/useProject.ts",
    
    # Tests
    "tests/rust-tests/integration_test.rs",
    "tests/java-tests/pom.xml",
    "tests/java-tests/src/test/java/com/codegen/ProjectServiceTest.java",
    "tests/frontend-tests/vitest.config.ts",
    "tests/frontend-tests/src/App.test.tsx",
    
    # Scripts
    "scripts/build-all.ps1",
    "scripts/setup-java.ps1",
    "scripts/download-models.ps1",
    
    # Resources
    "resources/ai-models/model-manifest.json",
    "resources/ai-models/README.md",
    "resources/licenses/MIT.txt",
    
    # Shared
    "shared/config/app-config.ts",
    "shared/schemas/project-schema.ts",
    "shared/types/index.ts",
    
    # GitHub
    ".github/workflows/test.yml",
    ".github/workflows/build.yml",
    
    # VS Code
    ".vscode/extensions.json",
    ".vscode/settings.json",
    ".vscode/launch.json",
    
    # Tauri icons
    ".tauri/icons/README.md"
)

$missingFiles = @()
$presentFiles = 0

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $presentFiles++
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        $missingFiles += $file
        Write-Host "✗ $file" -ForegroundColor Red
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "Present: $presentFiles/$($requiredFiles.Count) files" -ForegroundColor White

if ($missingFiles.Count -gt 0) {
    Write-Host "Missing: $($missingFiles.Count) files" -ForegroundColor Red
    Write-Host "`nMissing files:" -ForegroundColor Yellow
    $missingFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "✅ All files present!" -ForegroundColor Green
}

# Check directory structure
Write-Host "`n📁 Directory structure check:" -ForegroundColor Cyan

$requiredDirs = @(
    "src-tauri/src",
    "java-backend/src/main/java/com/codegen",
    "frontend/src/components",
    "tests",
    "resources",
    "shared",
    "config",
    ".github/workflows",
    ".tauri/icons",
    ".vscode"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir -PathType Container) {
        Write-Host "✓ $dir/" -ForegroundColor Green
    } else {
        Write-Host "✗ $dir/" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Verification complete!" -ForegroundColor Cyan

