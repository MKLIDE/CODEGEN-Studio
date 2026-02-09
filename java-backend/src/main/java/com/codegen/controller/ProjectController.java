package com.codegen.controller;

import com.codegen.model.Project;
import com.codegen.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:1420")
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String template = request.get("template");
            String path = request.get("path");
            
            if (name == null || template == null || path == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }
            
            // Validate project name
            if (!projectService.validateProjectName(name)) {
                return ResponseEntity.badRequest().body("Invalid project name");
            }
            
            Project project = projectService.createProject(name, template, path);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("project", project);
            response.put("message", "Project created successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to create project: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Project deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to delete project: " + e.getMessage());
        }
    }
    
    @PostMapping("/validate-name")
    public ResponseEntity<?> validateProjectName(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        
        boolean isValid = projectService.validateProjectName(name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("suggestions", isValid ? null : "Use only letters, numbers, hyphens, and underscores");
        
        return ResponseEntity.ok(response);
    }
}
