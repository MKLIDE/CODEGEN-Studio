package com.codegen.integration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Slf4j
public class AIIntegrationService {
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String aiServiceUrl;
    private boolean aiAvailable = false;
    
    public AIIntegrationService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.aiServiceUrl = "http://localhost:8081"; // Local AI service
        
        // Test connection on startup
        testAIConnection();
    }
    
    public void testAIConnection() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServiceUrl + "/health"))
                .GET()
                .timeout(java.time.Duration.ofSeconds(5))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            aiAvailable = response.statusCode() == 200;
            
            if (aiAvailable) {
                log.info("AI service is available at: {}", aiServiceUrl);
            } else {
                log.warn("AI service responded with status: {}", response.statusCode());
            }
        } catch (Exception e) {
            aiAvailable = false;
            log.debug("AI service not available: {}", e.getMessage());
        }
    }
    
    public String generateCode(String prompt, String language, String context) {
        if (!aiAvailable) {
            return generateFallbackResponse(prompt, language);
        }
        
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("prompt", prompt);
            requestBody.put("language", language);
            requestBody.put("context", context);
            requestBody.put("temperature", 0.1);
            requestBody.put("max_tokens", 512);
            
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServiceUrl + "/api/generate"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(java.time.Duration.ofSeconds(30))
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                return (String) responseBody.get("code");
            } else {
                log.error("AI generation failed with status: {}", response.statusCode());
                return generateFallbackResponse(prompt, language);
            }
        } catch (Exception e) {
            log.error("Failed to generate code with AI", e);
            return generateFallbackResponse(prompt, language);
        }
    }
    
    private String generateFallbackResponse(String prompt, String language) {
        // Simple fallback based on language
        switch (language.toLowerCase()) {
            case "java":
                return "// Fallback Java implementation for: " + prompt + "\n" +
                       "public class GeneratedCode {\n" +
                       "    public static void main(String[] args) {\n" +
                       "        // Implementation here\n" +
                       "    }\n" +
                       "}";
            case "javascript":
            case "typescript":
                return "// Fallback JavaScript implementation for: " + prompt + "\n" +
                       "function generatedFunction() {\n" +
                       "    // Implementation here\n" +
                       "}";
            case "python":
                return "# Fallback Python implementation for: " + prompt + "\n" +
                       "def generated_function():\n" +
                       "    # Implementation here\n" +
                       "    pass";
            default:
                return "// Implementation for: " + prompt + "\n" +
                       "// Language: " + language + "\n" +
                       "// TODO: Add implementation";
        }
    }
    
    public Map<String, Object> analyzeCode(String code, String language) {
        Map<String, Object> analysis = new HashMap<>();
        
        analysis.put("complexity", estimateComplexity(code));
        analysis.put("issues", detectIssues(code, language));
        analysis.put("suggestions", generateSuggestions(code, language));
        analysis.put("securityScore", calculateSecurityScore(code));
        
        return analysis;
    }
    
    private String estimateComplexity(String code) {
        int lines = code.split("\n").length;
        
        if (lines < 20) return "low";
        if (lines < 100) return "medium";
        return "high";
    }
    
    private String[] detectIssues(String code, String language) {
        // Simple issue detection
        java.util.List<String> issues = new java.util.ArrayList<>();
        
        if (code.contains("password") && !code.contains("encrypt")) {
            issues.add("Potential plaintext password storage");
        }
        
        if (code.contains("eval(") || code.contains("Function(")) {
            issues.add("Dangerous eval/Function usage");
        }
        
        if (code.contains("System.out.println") && language.equals("java")) {
            issues.add("Consider using logger instead of System.out");
        }
        
        return issues.toArray(new String[0]);
    }
    
    private String[] generateSuggestions(String code, String language) {
        java.util.List<String> suggestions = new java.util.ArrayList<>();
        
        suggestions.add("Add comments for complex logic");
        suggestions.add("Consider error handling");
        suggestions.add("Follow naming conventions");
        
        if (!code.contains("TODO") && !code.contains("FIXME")) {
            suggestions.add("Add TODO comments for pending work");
        }
        
        return suggestions.toArray(new String[0]);
    }
    
    private int calculateSecurityScore(String code) {
        int score = 100;
        
        // Deduct points for security issues
        if (code.contains("eval(")) score -= 30;
        if (code.contains("password = ")) score -= 20;
        if (code.contains("SELECT *")) score -= 15;
        
        return Math.max(0, score);
    }
    
    public boolean isAIAvailable() {
        return aiAvailable;
    }
}
