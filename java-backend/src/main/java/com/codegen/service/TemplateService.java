package com.codegen.service;

import com.codegen.model.Template;
import com.codegen.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateService {

    private final TemplateRepository templateRepository;

    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<Template> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }

    public Optional<Template> getTemplateByName(String name) {
        return templateRepository.findByName(name);
    }

    public Template saveTemplate(Template template) {
        return templateRepository.save(template);
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }

    public void generateFromTemplate(String templateName, String projectPath, String projectName) throws IOException {
        Optional<Template> templateOpt = getTemplateByName(templateName);
        if (templateOpt.isEmpty()) {
            throw new IOException("Template not found: " + templateName);
        }

        Template template = templateOpt.get();
        Path targetPath = Paths.get(projectPath);

        log.info("Generating project from template: {} to path: {}", templateName, projectPath);

        // Create placeholder files for the project
        String packagePath = projectName.toLowerCase().replace("-", "_").replace(".", "/");
        Path srcPath = targetPath.resolve("src").resolve("main").resolve("java").resolve(packagePath);

        Files.createDirectories(srcPath);

        // Create a simple Main.java placeholder
        String mainContent = String.format("""
                package %s;

                public class Main {
                    public static void main(String[] args) {
                        System.out.println("Hello from %s!");
                    }
                }
                """, projectName.toLowerCase().replace("-", "."), projectName);

        Files.writeString(srcPath.resolve("Main.java"), mainContent);

        log.info("Project generated successfully from template: {}", templateName);
    }
}
