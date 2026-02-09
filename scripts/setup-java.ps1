Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setting up Java for CodeGen Studio   " -ForegroundColor Cyan
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

function Test-Java {
    try {
        $javaOutput = java -version 2>&1
        if ($javaOutput -and $javaOutput.Count -gt 0) {
            # Get first line of output
            $firstLine = $javaOutput | Select-Object -First 1
            
            # Extract version from something like: java version "17.0.1" 2021-10-19 LTS
            if ($firstLine -match '"([^"]+)"') {
                $javaVersion = $matches[1]
                Write-Success "Java installed: $javaVersion"
                
                # Get major version (17.0.1 -> 17)
                $majorVersion = ($javaVersion -split '\.')[0]
                
                # Check if it's Java 17 or higher
                if ([int]$majorVersion -ge 17) {
                    Write-Success "Java version meets requirement (>= 17)"
                    return $true
                } else {
                    Write-Warning "Java version is $javaVersion, need 17 or higher"
                    return $false
                }
            } else {
                # Couldn't parse version format, but Java exists
                Write-Success "Java found (could not parse version)"
                return $true
            }
        } else {
            Write-Error "Java not found"
            return $false
        }
    } catch {
        Write-Error "Java not found: $($_.Exception.Message)"
        return $false
    }
}

function Test-Maven {
    try {
        $mvnOutput = mvn -version 2>&1
        if ($mvnOutput -and $mvnOutput.Count -gt 0) {
            # Get first line of output
            $firstLine = $mvnOutput | Select-Object -First 1
            
            # Extract version from something like: Apache Maven 3.9.0 (...
            if ($firstLine -match 'Apache Maven (\d+\.\d+\.\d+)') {
                $mvnVersion = $matches[1]
                Write-Success "Maven installed: $mvnVersion"
                return $true
            } else {
                Write-Success "Maven found (version unknown)"
                return $true
            }
        } else {
            Write-Error "Maven not found"
            return $false
        }
    } catch {
        Write-Error "Maven not found: $($_.Exception.Message)"
        return $false
    }
}

Write-Host "`n🔍 Checking Java installation..." -ForegroundColor Yellow

$javaOk = Test-Java
$mavenOk = Test-Maven

if ($javaOk -and $mavenOk) {
    Write-Host "`n" -NoNewline
    Write-Success "Java environment is ready!"
    pause
    exit 0
} else {
    Write-Host "`n" -NoNewline
    Write-Warning "Java setup incomplete"
    Write-Host "Please install:" -ForegroundColor Yellow
    Write-Host "1. Java JDK 17 or higher" -ForegroundColor White
    Write-Host "2. Apache Maven 3.8+" -ForegroundColor White
    Write-Host "`nOr run with embedded Java (coming soon)" -ForegroundColor Gray
    pause
    exit 1
}
