use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectTemplate {
    pub id: String,
    pub name: String,
    pub description: String,
    pub tags: Vec<String>,
    pub difficulty: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratedProject {
    pub name: String,
    pub path: String,
    pub files: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TemplateInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub tags: Vec<String>,
    pub difficulty: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    pub path: String,
    pub size: u64,
    pub modified: String,
    pub is_dir: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIResponse {
    pub code: String,
    pub explanation: String,
    pub alternatives: Vec<String>,
    pub confidence: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PrivacyReport {
    pub network_blocked: bool,
    pub local_processing: bool,
    pub encrypted_storage: bool,
    pub telemetry_disabled: bool,
    pub vulnerabilities: Vec<String>,
}
