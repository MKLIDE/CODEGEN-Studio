use std::path::{Path, PathBuf};
use std::fs;
use std::collections::HashMap;
use log::{info, warn, error};
use thiserror::Error;
use serde_json::Value;
use regex::Regex;

#[derive(Error, Debug)]
pub enum TemplateError {
    #[error("Template not found: {0}")]
    NotFound(String),
    #[error("Template parsing failed: {0}")]
    ParseError(String),
    #[error("Variable missing: {0}")]
    VariableMissing(String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

pub struct TemplateProcessor {
    templates_dir: PathBuf,
    variables: HashMap<String, String>,
}

impl TemplateProcessor {
    pub fn new() -> Self {
        let templates_dir = PathBuf::from("./java-backend/src/main/resources/templates");
        
        TemplateProcessor {
            templates_dir,
            variables: HashMap::new(),
        }
    }
    
    pub fn set_variable(&mut self, key: &str, value: &str) {
        self.variables.insert(key.to_string(), value.to_string());
    }
    
    pub fn set_variables(&mut self, vars: HashMap<String, String>) {
        self.variables.extend(vars);
    }
    
    pub fn list_templates(&self) -> Result<Vec<TemplateInfo>, TemplateError> {
        let mut templates = Vec::new();
        
        if !self.templates_dir.exists() {
            return Ok(templates);
        }
        
        let entries = fs::read_dir(&self.templates_dir)?;
        
        for entry in entries.flatten() {
            let path = entry.path();
            
            if path.is_dir() {
                let template_name = path.file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();
                
                let info = self.read_template_info(&path, &template_name);
                templates.push(info);
            }
        }
        
        Ok(templates)
    }
    
    fn read_template_info(&self, path: &Path, name: &str) -> TemplateInfo {
        let config_path = path.join("template.json");
        let description = if config_path.exists() {
            if let Ok(content) = fs::read_to_string(&config_path) {
                if let Ok(json) = serde_json::from_str::<Value>(&content) {
                    json["description"].as_str()
                        .unwrap_or("No description")
                        .to_string()
                } else {
                    "No description".to_string()
                }
            } else {
                "No description".to_string()
            }
        } else {
            "No description".to_string()
        };
        
        TemplateInfo {
            name: name.to_string(),
            description,
            path: path.to_string_lossy().to_string(),
            language: self.detect_language(path),
        }
    }
    
    fn detect_language(&self, path: &Path) -> String {
        // Check for package.json (Node.js/React)
        if path.join("package.json").exists() {
            return "javascript".to_string();
        }
        
        // Check for pom.xml (Java)
        if path.join("pom.xml").exists() {
            return "java".to_string();
        }
        
        // Check for Cargo.toml (Rust)
        if path.join("Cargo.toml").exists() {
            return "rust".to_string();
        }
        
        // Default
        "unknown".to_string()
    }
    
    pub fn generate_from_template(
        &self,
        template_name: &str,
        output_dir: &str,
        project_vars: &HashMap<String, String>,
    ) -> Result<Vec<GeneratedFile>, TemplateError> {
        let template_path = self.templates_dir.join(template_name);
        
        if !template_path.exists() {
            return Err(TemplateError::NotFound(template_name.to_string()));
        }
        
        info!("Generating from template: {} -> {}", template_name, output_dir);
        
        let output_path = PathBuf::from(output_dir);
        
        // Create output directory
        fs::create_dir_all(&output_path)?;
        
        // Process all files in template
        let mut generated_files = Vec::new();
        self.process_directory(&template_path, &output_path, project_vars, &mut generated_files)?;
        
        info!("✅ Generated {} files", generated_files.len());
        Ok(generated_files)
    }
    
    fn process_directory(
        &self,
        source_dir: &Path,
        target_dir: &Path,
        variables: &HashMap<String, String>,
        generated_files: &mut Vec<GeneratedFile>,
    ) -> Result<(), TemplateError> {
        for entry in fs::read_dir(source_dir)? {
            let entry = entry?;
            let source_path = entry.path();
            
            // Skip template config files
            if source_path.file_name()
                .and_then(|n| n.to_str())
                .map(|s| s == "template.json")
                .unwrap_or(false)
            {
                continue;
            }
            
            let file_name = entry.file_name();
            let target_path = target_dir.join(&file_name);
            
            if source_path.is_dir() {
                // Create directory and process recursively
                fs::create_dir_all(&target_path)?;
                self.process_directory(&source_path, &target_path, variables, generated_files)?;
            } else {
                // Process file
                let processed = self.process_file(&source_path, variables)?;
                
                // Write to target
                fs::write(&target_path, &processed)?;
                
                generated_files.push(GeneratedFile {
                    path: target_path.to_string_lossy().to_string(),
                    size: processed.len(),
                    processed: true,
                });
            }
        }
        
        Ok(())
    }
    
    fn process_file(&self, file_path: &Path, variables: &HashMap<String, String>) -> Result<Vec<u8>, TemplateError> {
        let content = fs::read_to_string(file_path)?;
        
        // Process template variables
        let processed = self.process_variables(&content, variables);
        
        Ok(processed.into_bytes())
    }
    
    fn process_variables(&self, content: &str, variables: &HashMap<String, String>) -> String {
        let mut result = content.to_string();
        
        // Replace variables in format {{variable_name}}
        let re = Regex::new(r"\{\{([^}]+)\}\}").unwrap();
        
        for capture in re.captures_iter(content) {
            if let Some(var_name) = capture.get(1) {
                let var_name = var_name.as_str().trim();
                if let Some(value) = variables.get(var_name) {
                    let placeholder = capture.get(0).unwrap().as_str();
                    result = result.replace(placeholder, value);
                }
            }
        }
        
        result
    }
}

#[derive(Debug, Clone)]
pub struct TemplateInfo {
    pub name: String,
    pub description: String,
    pub path: String,
    pub language: String,
}

#[derive(Debug, Clone)]
pub struct GeneratedFile {
    pub path: String,
    pub size: usize,
    pub processed: bool,
}

impl Default for TemplateProcessor {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_template_processor_creation() {
        let processor = TemplateProcessor::new();
        assert!(processor.variables.is_empty());
    }
    
    #[test]
    fn test_variable_processing() {
        let processor = TemplateProcessor::new();
        let mut variables = HashMap::new();
        variables.insert("project_name".to_string(), "MyProject".to_string());
        
        let content = "Project: {{project_name}}";
        let processed = processor.process_variables(content, &variables);
        
        assert_eq!(processed, "Project: MyProject");
    }
}
