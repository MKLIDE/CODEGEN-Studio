package com.codegen.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "codegen")
@Data
public class AppConfig {
    private String appName = "CodeGen Studio";
    private String version = "0.1.0";
    private String environment = "development";
    private boolean aiEnabled = false;
    private String modelPath = "./resources/ai-models";
    private int maxProjects = 100;
    private boolean telemetry = false;
    private boolean autoUpdates = false;
}
