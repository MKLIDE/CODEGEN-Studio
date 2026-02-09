package com.codegen.engine;

import com.codegen.model.Template;
import org.apache.velocity.*;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.springframework.stereotype.Component;

import java.io.StringWriter;
import java.util.Map;

@Component
public class TemplateEngine {
    
    private final VelocityEngine velocityEngine;
    
    public TemplateEngine() {
        velocityEngine = new VelocityEngine();
        velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADERS, "classpath");
        velocityEngine.setProperty("resource.loader.classpath.class", ClasspathResourceLoader.class.getName());
        velocityEngine.init();
    }
    
    public String processTemplate(String templateName, Map<String, Object> variables) {
        try {
            org.apache.velocity.Template template = velocityEngine.getTemplate("templates/" + templateName);
            VelocityContext context = new VelocityContext();
            
            variables.forEach(context::put);
            
            StringWriter writer = new StringWriter();
            template.merge(context, writer);
            
            return writer.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to process template: " + templateName, e);
        }
    }
    
    public String generateFromTemplate(Template template, Map<String, Object> variables) {
        String templateContent = loadTemplateContent(template.getPath());
        return processContent(templateContent, variables);
    }
    
    private String loadTemplateContent(String templatePath) {
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            return new String(classLoader.getResourceAsStream(templatePath).readAllBytes());
        } catch (Exception e) {
            throw new RuntimeException("Failed to load template: " + templatePath, e);
        }
    }
    
    private String processContent(String content, Map<String, Object> variables) {
        String processed = content;
        
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            processed = processed.replace(placeholder, value);
        }
        
        return processed;
    }
    
    public boolean validateTemplate(String templateContent) {
        if (templateContent == null || templateContent.trim().isEmpty()) {
            return false;
        }
        
        // Check for required placeholders
        return templateContent.contains("{{projectName}}") || 
               templateContent.contains("{{appName}}");
    }
}
