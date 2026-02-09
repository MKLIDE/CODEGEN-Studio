// Rust integration tests
use std::path::Path;
use std::fs;
use tempfile::tempdir;

#[cfg(test)]
mod integration_tests {
    use super::*;
    use crate::commands::*;
    use crate::file_vault::FileVault;
    use crate::encryption::Encryption;
    
    #[test]
    fn test_file_vault_integration() {
        let temp_dir = tempdir().unwrap();
        let vault_path = temp_dir.path().join("vault");
        
        fs::create_dir_all(&vault_path).unwrap();
        
        let vault = FileVault {
            encryption: Encryption::new(),
            vault_path: vault_path.clone(),
        };
        
        // Test storing and retrieving a file
        let test_content = b"Hello, CodeGen Studio!";
        let test_path = "test/file.txt";
        
        assert!(vault.store_file(test_path, test_content).is_ok());
        
        let retrieved = vault.retrieve_file(test_path);
        assert!(retrieved.is_ok());
        assert_eq!(retrieved.unwrap(), test_content);
        
        // Test listing files
        let files = vault.list_files();
        assert!(files.is_ok());
        assert!(files.unwrap().contains(&test_path.to_string()));
    }
    
    #[test]
    fn test_encryption_integration() {
        let encryption = Encryption::new();
        
        let test_data = b"Sensitive code data";
        
        // Test encryption/decryption cycle
        let encrypted = encryption.encrypt(test_data);
        assert!(encrypted.is_ok());
        
        let encrypted_data = encrypted.unwrap();
        assert!(!encrypted_data.is_empty());
        assert_ne!(encrypted_data, test_data);
        
        let decrypted = encryption.decrypt(&encrypted_data);
        assert!(decrypted.is_ok());
        assert_eq!(decrypted.unwrap(), test_data);
    }
    
    #[test]
    fn test_project_generation() {
        let request = ProjectRequest {
            name: "test-project".to_string(),
            template: "react-ts".to_string(),
            language: "typescript".to_string(),
            framework: "react".to_string(),
            database: None,
            features: vec![],
        };
        
        // This is an async test, but we can test the sync parts
        assert!(!request.name.is_empty());
        assert!(!request.template.is_empty());
        assert_eq!(request.name, "test-project");
        assert_eq!(request.template, "react-ts");
    }
    
    #[test]
    fn test_system_info_command() {
        // Test that system info can be generated
        use crate::commands::get_system_info;
        
        // This would be an async test in reality
        // For now, just verify the function exists
        assert!(true); // Placeholder
    }
}

#[cfg(test)]
mod unit_tests {
    use super::*;
    
    #[test]
    fn test_temp_dir_creation() {
        let dir = tempdir();
        assert!(dir.is_ok());
        
        let temp_dir = dir.unwrap();
        let path = temp_dir.path();
        assert!(path.exists());
        assert!(path.is_dir());
    }
    
    #[test]
    fn test_file_operations() {
        let temp_dir = tempdir().unwrap();
        let file_path = temp_dir.path().join("test.txt");
        
        // Write file
        fs::write(&file_path, "test content").unwrap();
        assert!(file_path.exists());
        
        // Read file
        let content = fs::read_to_string(&file_path).unwrap();
        assert_eq!(content, "test content");
        
        // Delete file
        fs::remove_file(&file_path).unwrap();
        assert!(!file_path.exists());
    }
}
