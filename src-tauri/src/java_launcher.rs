use std::process::{Command, Child};
use std::path::Path;
use log::{info, error, warn};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum JavaError {
    #[error("Java not found")]
    NotFound,
    #[error("Failed to start Java: {0}")]
    StartError(String),
    #[error("Process error: {0}")]
    ProcessError(String),
}

pub struct JavaProcess {
    child: Option<Child>,
    pid: u32,
}

impl JavaProcess {
    pub fn start(jar_path: &str) -> Result<Self, JavaError> {
        info!("Starting Java backend from: {}", jar_path);
        
        if !Path::new(jar_path).exists() {
            return Err(JavaError::NotFound);
        }
        
        let child = Command::new("java")
            .arg("-jar")
            .arg(jar_path)
            .spawn()
            .map_err(|e| JavaError::StartError(e.to_string()))?;
        
        let pid = child.id();
        
        info!("✅ Java backend started with PID: {}", pid);
        
        Ok(JavaProcess {
            child: Some(child),
            pid,
        })
    }
    
    pub fn stop(&mut self) -> Result<(), JavaError> {
        if let Some(ref mut child) = self.child {
            child.kill().map_err(|e| JavaError::ProcessError(e.to_string()))?;
            self.child = None;
            info!("Java backend stopped");
        }
        Ok(())
    }
    
    pub fn is_running(&self) -> bool {
        self.child.is_some()
    }
    
    pub fn pid(&self) -> u32 {
        self.pid
    }
}

impl Drop for JavaProcess {
    fn drop(&mut self) {
        if self.is_running() {
            let _ = self.stop();
        }
    }
}

pub fn start_embedded_jvm() -> Result<JavaProcess, JavaError> {
    // First try to use embedded JVM
    let jar_path = "./resources/jar/codegen-backend.jar";
    
    if Path::new(jar_path).exists() {
        return JavaProcess::start(jar_path);
    }
    
    // Fall back to system Java
    warn!("Embedded JVM not found, trying system Java...");
    
    // Check if java is available
    let java_check = Command::new("java")
        .arg("--version")
        .output();
    
    match java_check {
        Ok(output) if output.status.success() => {
            info!("System Java found: {:?}", String::from_utf8_lossy(&output.stdout));
            JavaProcess::start(jar_path)
        }
        _ => {
            error!("No Java installation found");
            Err(JavaError::NotFound)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_java_launcher_creation() {
        // Test struct creation
        let process = JavaProcess {
            child: None,
            pid: 0,
        };
        
        assert!(!process.is_running());
        assert_eq!(process.pid(), 0);
    }
}
