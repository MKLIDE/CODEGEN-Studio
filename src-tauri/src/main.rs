#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod java_launcher;
mod privacy_guard;
mod file_vault;
mod ai_engine;
mod commands;
mod models;
mod llama_bridge;
mod model_manager;
mod encryption;
mod template_processor;
mod utils;

use std::sync::{Arc, Mutex};
use tauri::Manager;
use log::{info, error, warn, debug};
use commands::*;

#[derive(Default)]
pub struct AppState {
    privacy_guard: Mutex<Option<privacy_guard::PrivacyGuard>>,
    ai_engine: Mutex<Option<ai_engine::AiEngine>>,
    file_vault: Mutex<file_vault::FileVault>,
    java_process: Mutex<Option<java_launcher::JavaProcess>>,
    model_manager: Mutex<model_manager::ModelManager>,
}

fn main() {
    // Setup logging
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .format_timestamp(Some(env_logger::fmt::TimestampPrecision::Millis))
        .format_module_path(false)
        .format_target(false)
        .init();

    info!("🚀 Starting CodeGen Studio v0.1.0");
    
    // Initialize application state
    let app_state = Arc::new(AppState::default());
    
    tauri::Builder::default()
        .manage(app_state.clone())
        .setup(move |app| {
            info!("🔧 Setting up application...");
            
            // Load configuration
            if let Err(e) = utils::load_config() {
                warn!("⚠️ Failed to load config: {}", e);
            }
            
            // Initialize privacy guard
            match privacy_guard::PrivacyGuard::new() {
                Ok(guard) => {
                    *app_state.privacy_guard.lock().unwrap() = Some(guard);
                    info!("✅ Privacy guard initialized");
                }
                Err(e) => {
                    error!("❌ Failed to initialize privacy guard: {}", e);
                    return Err(tauri::Error::Setup(Box::new(e)));
                }
            }
            
            // Start Java backend
            match java_launcher::start_embedded_jvm() {
                Ok(process) => {
                    *app_state.java_process.lock().unwrap() = Some(process);
                    info!("✅ Java backend started");
                }
                Err(e) => {
                    warn!("⚠️ Java backend failed to start: {}", e);
                    // Continue without Java for now
                }
            }
            
            // Initialize AI engine (lazy)
            *app_state.ai_engine.lock().unwrap() = Some(ai_engine::AiEngine::new_lazy());
            info!("✅ AI engine initialized (lazy)");
            
            // Initialize file vault
            *app_state.file_vault.lock().unwrap() = file_vault::FileVault::new();
            info!("✅ File vault initialized");
            
            // Initialize model manager
            *app_state.model_manager.lock().unwrap() = model_manager::ModelManager::new();
            info!("✅ Model manager initialized");
            
            // Show welcome notification
            #[cfg(not(debug_assertions))]
            tauri::api::notification::Notification::new(&app.config().tauri.bundle.identifier)
                .title("CodeGen Studio")
                .body("Your privacy-first development environment is ready!")
                .show()
                .ok();
            
            info!("🎉 Setup complete!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            generate_project,
            get_ai_suggestion,
            export_project,
            check_privacy_status,
            get_system_info,
            open_project_folder,
            save_file,
            load_file,
            list_templates,
            check_ai_status,
            load_ai_model,
            create_new_project,
            run_project,
            run_tests,
            get_project_structure,
            encrypt_file,
            decrypt_file,
            scan_project,
            analyze_code,
            generate_code_from_template,
            get_code_completion,
            validate_code,
            format_code,
            optimize_code,
            check_security,
            get_performance_metrics
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                info!("Window destroyed, cleaning up...");
                // Cleanup resources
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running CodeGen Studio");
}
