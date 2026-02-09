use std::fs;
use std::path::Path;
use log::{info, warn, error};
use serde_json::Value;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("Config file not found: {0}")]
    NotFound(String),
    #[error("Parse error: {0}")]
    ParseError(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

pub fn load_config() -> Result<Value, ConfigError> {
    let config_paths = vec![
        "./config/config.json",
        "./config/default.json",
        ".env",
    ];
    
    for path in config_paths {
        if Path::new(path).exists() {
            info!("Loading config from: {}", path);
            
            let content = fs::read_to_string(path)?;
            
            if path.ends_with(".json") {
                let config: Value = serde_json::from_str(&content)
                    .map_err(|e| ConfigError::ParseError(e.to_string()))?;
                return Ok(config);
            } else if path.ends_with(".env") {
                // Parse .env file
                let mut config = serde_json::Map::new();
                
                for line in content.lines() {
                    if let Some((key, value)) = line.split_once('=') {
                        config.insert(key.trim().to_string(), Value::String(value.trim().to_string()));
                    }
                }
                
                return Ok(Value::Object(config));
            }
        }
    }
    
    warn!("No config file found, using defaults");
    Ok(Value::Object(serde_json::Map::new()))
}

pub fn ensure_directories() -> Result<(), std::io::Error> {
    let dirs = vec![
        "./data",
        "./data/vault",
        "./data/projects",
        "./data/logs",
        "./data/cache",
        "./data/temp",
        "./config",
        "./resources",
        "./resources/ai-models",
        "./resources/jvm",
        "./resources/binaries",
    ];
    
    for dir in dirs {
        if !Path::new(dir).exists() {
            fs::create_dir_all(dir)?;
            info!("Created directory: {}", dir);
        }
    }
    
    Ok(())
}

pub fn get_system_info() -> SystemInfo {
    #[cfg(target_os = "windows")]
    let os = "Windows";
    
    #[cfg(target_os = "macos")]
    let os = "macOS";
    
    #[cfg(target_os = "linux")]
    let os = "Linux";
    
    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    let os = "Unknown";
    
    let arch = std::env::consts::ARCH;
    let family = std::env::consts::FAMILY;
    
    SystemInfo {
        os: os.to_string(),
        arch: arch.to_string(),
        family: family.to_string(),
        total_memory: get_total_memory(),
        num_cpus: num_cpus::get(),
        rust_version: rustc_version::version().unwrap_or_default().to_string(),
    }
}

fn get_total_memory() -> u64 {
    #[cfg(target_os = "windows")]
    {
        use winapi::um::sysinfoapi::{GlobalMemoryStatusEx, MEMORYSTATUSEX};
        unsafe {
            let mut mem_status: MEMORYSTATUSEX = std::mem::zeroed();
            mem_status.dwLength = std::mem::size_of::<MEMORYSTATUSEX>() as u32;
            
            if GlobalMemoryStatusEx(&mut mem_status) != 0 {
                mem_status.ullTotalPhys
            } else {
                0
            }
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        use sysinfo::System;
        let mut sys = System::new_all();
        sys.refresh_memory();
        sys.total_memory()
    }
    
    #[cfg(target_os = "macos")]
    {
        let output = std::process::Command::new("sysctl")
            .arg("-n")
            .arg("hw.memsize")
            .output()
            .ok()
            .and_then(|o| String::from_utf8(o.stdout).ok());
        
        output
            .and_then(|s| s.trim().parse::<u64>().ok())
            .unwrap_or(0)
    }
    
    #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
    {
        0
    }
}

pub fn format_size(bytes: u64) -> String {
    const UNITS: [&str; 6] = ["B", "KB", "MB", "GB", "TB", "PB"];
    
    if bytes == 0 {
        return "0 B".to_string();
    }
    
    let exp = (bytes.ilog10() / 3) as usize;
    let divisor = 1000_f64.powi(exp as i32);
    let size = bytes as f64 / divisor;
    
    format!("{:.2} {}", size, UNITS[exp])
}

pub fn is_valid_project_name(name: &str) -> bool {
    if name.is_empty() || name.len() > 50 {
        return false;
    }
    
    // Check for invalid characters
    let invalid_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
    if name.chars().any(|c| invalid_chars.contains(&c)) {
        return false;
    }
    
    // Check for reserved names
    let reserved = [
        "con", "prn", "aux", "nul",
        "com1", "com2", "com3", "com4",
        "lpt1", "lpt2", "lpt3", "lpt4",
    ];
    
    let lower_name = name.to_lowercase();
    !reserved.contains(&lower_name.as_str())
}

pub fn sanitize_filename(filename: &str) -> String {
    let invalid_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
    filename
        .chars()
        .map(|c| if invalid_chars.contains(&c) { '_' } else { c })
        .collect()
}

#[derive(Debug, Clone)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub family: String,
    pub total_memory: u64,
    pub num_cpus: usize,
    pub rust_version: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_format_size() {
        assert_eq!(format_size(0), "0 B");
        assert_eq!(format_size(1024), "1.02 KB");
        assert_eq!(format_size(1024 * 1024), "1.05 MB");
    }
    
    #[test]
    fn test_is_valid_project_name() {
        assert!(is_valid_project_name("my-project"));
        assert!(is_valid_project_name("test123"));
        assert!(!is_valid_project_name("con"));
        assert!(!is_valid_project_name("test/../hack"));
        assert!(!is_valid_project_name(""));
    }
    
    #[test]
    fn test_sanitize_filename() {
        assert_eq!(sanitize_filename("test/file.txt"), "test_file.txt");
        assert_eq!(sanitize_filename("test:file"), "test_file");
        assert_eq!(sanitize_filename("normal.txt"), "normal.txt");
    }
}
