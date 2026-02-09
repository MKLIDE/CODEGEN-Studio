package com.codegen.service;

import com.codegen.model.Project;
import com.codegen.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final TemplateService templateService;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    public Optional<Project> getProjectByName(String name) {
        return projectRepository.findByName(name);
    }
    
    @Transactional
    public Project createProject(String name, String templateName, String basePath) throws IOException {
        // Check if project already exists
        if (projectRepository.existsByName(name)) {
            throw new IllegalArgumentException("Project with name '" + name + "' already exists");
        }
        
        // Create project directory
        String projectPath = basePath + File.separator + name;
        Path path = Paths.get(projectPath);
        
        if (Files.exists(path)) {
            throw new IOException("Directory already exists: " + projectPath);
        }
        
        Files.createDirectories(path);
        
        // Generate project from template
        templateService.generateFromTemplate(templateName, projectPath, name);
        
        // Save project to database
        Project project = new Project();
        project.setName(name);
        project.setPath(projectPath);
        project.setTemplate(templateName);
        project.setLanguage(detectLanguage(templateName));
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        
        return projectRepository.save(project);
    }
    
    @Transactional
    public void deleteProject(Long id) throws IOException {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            
            // Delete directory
            Path path = Paths.get(project.getPath());
            if (Files.exists(path)) {
                Files.walk(path)
                    .sorted((a, b) -> -a.compareTo(b))
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            log.error("Failed to delete file: {}", p, e);
                        }
                    });
            }
            
            // Delete from database
            projectRepository.deleteById(id);
        }
    }
    
    private String detectLanguage(String templateName) {
        if (templateName.contains("react") || templateName.contains("node")) {
            return "javascript";
        } else if (templateName.contains("spring") || templateName.contains("java")) {
            return "java";
        } else if (templateName.contains("python")) {
            return "python";
        } else if (templateName.contains("rust")) {
            return "rust";
        }
        return "unknown";
    }
    
    public boolean validateProjectName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        // Check for invalid characters
        String invalidChars = "[\\\\/:*?\"<>|]";
        if (name.matches(".*" + invalidChars + ".*")) {
            return false;
        }
        
        // Check for reserved names (Windows)
        String[] reservedNames = {
            "CON", "PRN", "AUX", "NUL",
            "COM1", "COM2", "COM3", "COM4",
            "LPT1", "LPT2", "LPT3", "LPT4"
        };
        
        String upperName = name.toUpperCase();
        for (String reserved : reservedNames) {
            if (upperName.equals(reserved)) {
                return false;
            }
        }
        
        return true;
    }
}
