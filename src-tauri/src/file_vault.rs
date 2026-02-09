use std::path::{Path, PathBuf};
use std::fs;
use std::io::{Read, Write};
use log::{info, warn, error};
use thiserror::Error;
use crate::encryption::Encryption;

#[derive(Error, Debug)]
pub enum FileVaultError {
    #[error("File not found: {0}")]
    NotFound(String),
    #[error("Permission denied: {0}")]
    PermissionDenied(String),
    #[error("Encryption error: {0}")]
    EncryptionError(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

pub struct FileVault {
    encryption: Encryption,
    vault_path: PathBuf,
}

impl FileVault {
    pub fn new() -> Self {
        let vault_path = PathBuf::from("./data/vault");
        
        // Create vault directory if it doesn't exist
        if let Err(e) = fs::create_dir_all(&vault_path) {
            error!("Failed to create vault directory: {}", e);
        }
        
        FileVault {
            encryption: Encryption::new(),
            vault_path,
        }
    }
    
    pub fn store_file(&self, path: &str, content: &[u8]) -> Result<(), FileVaultError> {
        let file_path = self.vault_path.join(path);
        
        // Create parent directories
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent)?;
        }
        
        // Encrypt the content
        let encrypted = self.encryption.encrypt(content)?;
        
        // Write to file
        fs::write(&file_path, encrypted)?;
        
        info!("File stored in vault: {}", path);
        Ok(())
    }
    
    pub fn retrieve_file(&self, path: &str) -> Result<Vec<u8>, FileVaultError> {
        let file_path = self.vault_path.join(path);
        
        if !file_path.exists() {
            return Err(FileVaultError::NotFound(path.to_string()));
        }
        
        // Read encrypted content
        let encrypted = fs::read(&file_path)?;
        
        // Decrypt
        let decrypted = self.encryption.decrypt(&encrypted)?;
        
        info!("File retrieved from vault: {}", path);
        Ok(decrypted)
    }
    
    pub fn list_files(&self) -> Result<Vec<String>, FileVaultError> {
        let mut files = Vec::new();
        
        fn collect_files(path: &Path, base: &Path, files: &mut Vec<String>) -> std::io::Result<()> {
            for entry in fs::read_dir(path)? {
                let entry = entry?;
                let file_type = entry.file_type()?;
                
                if file_type.is_file() {
                    let relative_path = entry.path().strip_prefix(base)
                        .unwrap_or(&entry.path())
                        .to_string_lossy()
                        .to_string();
                    files.push(relative_path);
                } else if file_type.is_dir() {
                    collect_files(&entry.path(), base, files)?;
                }
            }
            Ok(())
        }
        
        collect_files(&self.vault_path, &self.vault_path, &mut files)?;
        
        Ok(files)
    }
    
    pub fn delete_file(&self, path: &str) -> Result<(), FileVaultError> {
        let file_path = self.vault_path.join(path);
        
        if !file_path.exists() {
            return Err(FileVaultError::NotFound(path.to_string()));
        }
        
        // Secure delete (overwrite with zeros before deletion)
        self.secure_delete(&file_path)?;
        
        info!("File securely deleted from vault: {}", path);
        Ok(())
    }
    
    fn secure_delete(&self, path: &Path) -> Result<(), FileVaultError> {
        // Overwrite with zeros
        if path.is_file() {
            if let Ok(metadata) = fs::metadata(path) {
                let size = metadata.len() as usize;
                let zeros = vec![0u8; size];
                
                // Try to overwrite (might fail if file is read-only)
                let _ = fs::write(path, &zeros);
            }
        }
        
        // Delete the file
        fs::remove_file(path)?;
        
        Ok(())
    }
    
    pub fn get_vault_info(&self) -> VaultInfo {
        let total_size = self.calculate_vault_size();
        
        VaultInfo {
            path: self.vault_path.to_string_lossy().to_string(),
            total_files: self.count_files(),
            total_size,
            encrypted: true,
        }
    }
    
    fn calculate_vault_size(&self) -> u64 {
        fn calculate_dir_size(path: &Path) -> u64 {
            let mut total = 0;
            
            if let Ok(entries) = fs::read_dir(path) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file() {
                        total += entry.metadata().map(|m| m.len()).unwrap_or(0);
                    } else if path.is_dir() {
                        total += calculate_dir_size(&path);
                    }
                }
            }
            
            total
        }
        
        calculate_dir_size(&self.vault_path)
    }
    
    fn count_files(&self) -> usize {
        fn count_dir_files(path: &Path) -> usize {
            let mut total = 0;
            
            if let Ok(entries) = fs::read_dir(path) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file() {
                        total += 1;
                    } else if path.is_dir() {
                        total += count_dir_files(&path);
                    }
                }
            }
            
            total
        }
        
        count_dir_files(&self.vault_path)
    }
}

#[derive(Debug, Clone)]
pub struct VaultInfo {
    pub path: String,
    pub total_files: usize,
    pub total_size: u64,
    pub encrypted: bool,
}

impl Default for FileVault {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_file_vault_creation() {
        let temp_dir = tempdir().unwrap();
        let vault = FileVault {
            encryption: Encryption::new(),
            vault_path: temp_dir.path().to_path_buf(),
        };
        
        let info = vault.get_vault_info();
        assert_eq!(info.total_files, 0);
        assert_eq!(info.total_size, 0);
    }
}
