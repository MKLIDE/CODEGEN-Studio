package com.codegen.engine;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class AIEngine {
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String aiServerUrl;
    
    public AIEngine() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.aiServerUrl = "http://localhost:8081"; // Default AI server port
    }
    
    public String getCodeSuggestion(String prompt, String language, String context) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("prompt", prompt);
            request.put("language", language);
            request.put("context", context);
            request.put("temperature", 0.1);
            request.put("max_tokens", 512);
            
            String requestBody = objectMapper.writeValueAsString(request);
            
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(aiServerUrl + "/api/ai/generate"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
            
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                return (String) responseBody.get("code");
            } else {
                log.error("AI request failed with status: {}", response.statusCode());
                return generateFallbackSuggestion(prompt, language);
            }
        } catch (Exception e) {
            log.error("Failed to get AI suggestion", e);
            return generateFallbackSuggestion(prompt, language);
        }
    }
    
    private String generateFallbackSuggestion(String prompt, String language) {
        // Simple fallback suggestions based on language
        switch (language.toLowerCase()) {
            case "java":
                return "// Java code suggestion for: " + prompt + "\n" +
                       "// Implement based on best practices\n" +
                       "// Consider error handling and null safety";
            case "javascript":
            case "typescript":
                return "// JavaScript/TypeScript code suggestion for: " + prompt + "\n" +
                       "function process(input) {\n" +
                       "    // Add implementation here\n" +
                       "    return input;\n" +
                       "}";
            case "python":
                return "# Python code suggestion for: " + prompt + "\n" +
                       "def process(input):\n" +
                       "    # Add implementation here\n" +
                       "    return input";
            default:
                return "// Code suggestion for: " + prompt + "\n" +
                       "// Language: " + language + "\n" +
                       "// TODO: Implement functionality";
        }
    }
    
    public boolean isAvailable() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServerUrl + "/health"))
                .GET()
                .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.debug("AI server not available: {}", e.getMessage());
            return false;
        }
    }
    
    public Map<String, Object> analyzeCode(String code, String language) {
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("complexity", "medium");
        analysis.put("suggestions", new String[]{
            "Add comments for complex logic",
            "Consider error handling",
            "Follow naming conventions"
        });
        analysis.put("issues", new String[]{});
        
        return analysis;
    }
}
