use std::path::{Path, PathBuf};
use std::fs;
use std::collections::HashMap;
use log::{info, warn, error};
use thiserror::Error;
use serde::{Deserialize, Serialize};

#[derive(Error, Debug)]
pub enum ModelError {
    #[error("Model not found: {0}")]
    NotFound(String),
    #[error("Download failed: {0}")]
    DownloadError(String),
    #[error("Validation failed: {0}")]
    ValidationError(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub format: String,
    pub version: String,
    pub description: String,
    pub tags: Vec<String>,
    pub loaded: bool,
}

pub struct ModelManager {
    models: HashMap<String, ModelInfo>,
    model_dir: PathBuf,
}

impl ModelManager {
    pub fn new() -> Self {
        let model_dir = PathBuf::from("./resources/ai-models");
        
        // Create directory if it doesn't exist
        if let Err(e) = fs::create_dir_all(&model_dir) {
            error!("Failed to create model directory: {}", e);
        }
        
        let mut manager = ModelManager {
            models: HashMap::new(),
            model_dir,
        };
        
        // Scan for existing models
        manager.scan_models();
        
        manager
    }
    
    pub fn scan_models(&mut self) {
        info!("Scanning for AI models...");
        
        if !self.model_dir.exists() {
            warn!("Model directory does not exist: {:?}", self.model_dir);
            return;
        }
        
        let entries = match fs::read_dir(&self.model_dir) {
            Ok(entries) => entries,
            Err(e) => {
                error!("Failed to read model directory: {}", e);
                return;
            }
        };
        
        for entry in entries.flatten() {
            let path = entry.path();
            
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "gguf" || ext == "bin" || ext == "safetensors" {
                        self.add_model_from_path(&path);
                    }
                }
            }
        }
        
        info!("Found {} AI models", self.models.len());
    }
    
    fn add_model_from_path(&mut self, path: &Path) {
        let file_name = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("unknown")
            .to_string();
        
        let size = match fs::metadata(path) {
            Ok(metadata) => metadata.len(),
            Err(_) => 0,
        };
        
        let model_info = ModelInfo {
            name: file_name.clone(),
            path: path.to_string_lossy().to_string(),
            size,
            format: path.extension()
                .and_then(|e| e.to_str())
                .unwrap_or("unknown")
                .to_string(),
            version: "1.0".to_string(),
            description: format!("AI model: {}", file_name),
            tags: vec!["code".to_string(), "generation".to_string()],
            loaded: false,
        };
        
        self.models.insert(file_name.clone(), model_info);
        info!("Registered model: {}", file_name);
    }
    
    pub fn list_models(&self) -> Vec<ModelInfo> {
        self.models.values().cloned().collect()
    }
    
    pub fn get_model(&self, name: &str) -> Option<&ModelInfo> {
        self.models.get(name)
    }
    
    pub fn download_model(&mut self, url: &str, name: &str) -> Result<ModelInfo, ModelError> {
        info!("Downloading model from: {}", url);
        
        // Create temp file path
        let temp_path = self.model_dir.join(format!("{}.download", name));
        
        // In a real implementation, this would download the file
        // For now, simulate download
        
        std::thread::sleep(std::time::Duration::from_secs(2));
        
        let final_path = self.model_dir.join(name);
        
        // Create a dummy file for simulation
        fs::write(&final_path, b"SIMULATED_MODEL_DATA")?;
        
        let model_info = ModelInfo {
            name: name.to_string(),
            path: final_path.to_string_lossy().to_string(),
            size: 1024, // Dummy size
            format: "gguf".to_string(),
            version: "1.0".to_string(),
            description: format!("Downloaded model: {}", name),
            tags: vec!["downloaded".to_string(), "code".to_string()],
            loaded: false,
        };
        
        self.models.insert(name.to_string(), model_info.clone());
        
        info!("✅ Model downloaded: {}", name);
        Ok(model_info)
    }
    
    pub fn validate_model(&self, name: &str) -> Result<bool, ModelError> {
        let model = self.get_model(name)
            .ok_or_else(|| ModelError::NotFound(name.to_string()))?;
        
        // Check if file exists
        if !Path::new(&model.path).exists() {
            return Err(ModelError::NotFound(model.path.clone()));
        }
        
        // Check file size
        let metadata = fs::metadata(&model.path)?;
        if metadata.len() == 0 {
            return Err(ModelError::ValidationError("File is empty".to_string()));
        }
        
        // Basic validation passed
        Ok(true)
    }
    
    pub fn mark_as_loaded(&mut self, name: &str) -> Result<(), ModelError> {
        if let Some(model) = self.models.get_mut(name) {
            model.loaded = true;
            info!("Model marked as loaded: {}", name);
            Ok(())
        } else {
            Err(ModelError::NotFound(name.to_string()))
        }
    }
    
    pub fn get_loaded_model(&self) -> Option<&ModelInfo> {
        self.models.values().find(|m| m.loaded)
    }
    
    pub fn get_model_dir(&self) -> &Path {
        &self.model_dir
    }
}

impl Default for ModelManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_model_manager_creation() {
        let temp_dir = tempdir().unwrap();
        let manager = ModelManager {
            models: HashMap::new(),
            model_dir: temp_dir.path().to_path_buf(),
        };
        
        assert!(manager.models.is_empty());
    }
}
