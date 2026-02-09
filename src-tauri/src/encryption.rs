use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use log::{info, error};
use thiserror::Error;
use std::sync::OnceLock;

#[derive(Error, Debug)]
pub enum EncryptionError {
    #[error("Encryption failed: {0}")]
    EncryptionFailed(String),
    #[error("Decryption failed: {0}")]
    DecryptionFailed(String),
    #[error("Key generation failed")]
    KeyGenerationFailed,
}

pub struct Encryption {
    key: [u8; 32],
    cipher: Aes256Gcm,
}

impl Encryption {
    pub fn new() -> Self {
        // Generate a key (in production, this should be stored securely)
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        
        let cipher = Aes256Gcm::new(&key.into());
        
        Encryption { key, cipher }
    }
    
    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, EncryptionError> {
        // Generate a random nonce
        let mut nonce_bytes = [0u8; 12];
        OsRng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);
        
        // Encrypt the data
        let ciphertext = self.cipher
            .encrypt(nonce, data)
            .map_err(|e| EncryptionError::EncryptionFailed(e.to_string()))?;
        
        // Combine nonce + ciphertext
        let mut result = Vec::with_capacity(nonce_bytes.len() + ciphertext.len());
        result.extend_from_slice(&nonce_bytes);
        result.extend_from_slice(&ciphertext);
        
        Ok(result)
    }
    
    pub fn decrypt(&self, encrypted_data: &[u8]) -> Result<Vec<u8>, EncryptionError> {
        if encrypted_data.len() < 12 {
            return Err(EncryptionError::DecryptionFailed(
                "Data too short to contain nonce".to_string()
            ));
        }
        
        // Extract nonce
        let nonce = Nonce::from_slice(&encrypted_data[..12]);
        let ciphertext = &encrypted_data[12..];
        
        // Decrypt
        let plaintext = self.cipher
            .decrypt(nonce, ciphertext)
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))?;
        
        Ok(plaintext)
    }
    
    pub fn encrypt_string(&self, text: &str) -> Result<String, EncryptionError> {
        let encrypted = self.encrypt(text.as_bytes())?;
        Ok(base64::encode(encrypted))
    }
    
    pub fn decrypt_string(&self, encrypted_text: &str) -> Result<String, EncryptionError> {
        let encrypted_data = base64::decode(encrypted_text)
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))?;
        
        let decrypted = self.decrypt(&encrypted_data)?;
        String::from_utf8(decrypted)
            .map_err(|e| EncryptionError::DecryptionFailed(e.to_string()))
    }
    
    pub fn generate_key() -> Result<[u8; 32], EncryptionError> {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        Ok(key)
    }
    
    pub fn get_key_hash(&self) -> String {
        // Return a hash of the key for identification (not the actual key)
        let hash = sha2::Sha256::digest(&self.key);
        hex::encode(hash)
    }
}

impl Default for Encryption {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_encryption_decryption() {
        let encryption = Encryption::new();
        let test_data = b"Hello, CodeGen Studio!";
        
        // Test encryption
        let encrypted = encryption.encrypt(test_data);
        assert!(encrypted.is_ok());
        
        // Test decryption
        let decrypted = encryption.decrypt(&encrypted.unwrap());
        assert!(decrypted.is_ok());
        assert_eq!(decrypted.unwrap(), test_data);
    }
    
    #[test]
    fn test_string_encryption() {
        let encryption = Encryption::new();
        let test_string = "Secret code generation data";
        
        let encrypted = encryption.encrypt_string(test_string);
        assert!(encrypted.is_ok());
        
        let decrypted = encryption.decrypt_string(&encrypted.unwrap());
        assert!(decrypted.is_ok());
        assert_eq!(decrypted.unwrap(), test_string);
    }
}
