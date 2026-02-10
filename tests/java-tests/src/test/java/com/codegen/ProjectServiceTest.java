package com.codegen;

import com.codegen.model.Project;
import com.codegen.repository.ProjectRepository;
import com.codegen.service.ProjectService;
import com.codegen.service.TemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    
    @Mock
    private ProjectRepository projectRepository;
    
    @Mock
    private TemplateService templateService;
    
    @InjectMocks
    private ProjectService projectService;
    
    private Project testProject;
    
    @BeforeEach
    void setUp() {
        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("test-project");
        testProject.setPath("/tmp/test-project");
        testProject.setTemplate("react-ts");
        testProject.setLanguage("typescript");
        testProject.setCreatedAt(LocalDateTime.now());
        testProject.setUpdatedAt(LocalDateTime.now());
    }
    
    @Test
    void testCreateProject_Success() throws IOException {
        // Given
        when(projectRepository.existsByName("test-project")).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);
        
        doNothing().when(templateService).generateFromTemplate(anyString(), anyString(), anyString());
        
        // When
        Project result = projectService.createProject("test-project", "react-ts", "/tmp");
        
        // Then
        assertNotNull(result);
        assertEquals("test-project", result.getName());
        assertEquals("react-ts", result.getTemplate());
        verify(projectRepository, times(1)).save(any(Project.class));
        verify(templateService, times(1)).generateFromTemplate(anyString(), anyString(), anyString());
    }
    
    @Test
    void testCreateProject_AlreadyExists() {
        // Given
        when(projectRepository.existsByName("existing-project")).thenReturn(true);
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            projectService.createProject("existing-project", "react-ts", "/tmp");
        });
    }
    
    @Test
    void testGetProjectById_Found() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        
        // When
        Optional<Project> result = projectService.getProjectById(1L);
        
        // Then
        assertTrue(result.isPresent());
        assertEquals("test-project", result.get().getName());
    }
    
    @Test
    void testGetProjectById_NotFound() {
        // Given
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When
        Optional<Project> result = projectService.getProjectById(999L);
        
        // Then
        assertFalse(result.isPresent());
    }
    
    @Test
    void testValidateProjectName_Valid() {
        assertTrue(projectService.validateProjectName("my-project"));
        assertTrue(projectService.validateProjectName("project123"));
        assertTrue(projectService.validateProjectName("test_project"));
    }
    
    @Test
    void testValidateProjectName_Invalid() {
        assertFalse(projectService.validateProjectName("")); // Empty
        assertFalse(projectService.validateProjectName("con")); // Reserved
        assertFalse(projectService.validateProjectName("test/project")); // Invalid char
        assertFalse(projectService.validateProjectName("test\\project")); // Invalid char
        assertFalse(projectService.validateProjectName("test:project")); // Invalid char
    }
    
    @Test
    void testDetectLanguage() {
        // Using reflection to test private method
        String reactResult = (String) ReflectionTestUtils.invokeMethod(
            projectService, "detectLanguage", "react-ts"
        );
        assertEquals("javascript", reactResult);
        
        String springResult = (String) ReflectionTestUtils.invokeMethod(
            projectService, "detectLanguage", "spring-boot"
        );
        assertEquals("java", springResult);
        
        String unknownResult = (String) ReflectionTestUtils.invokeMethod(
            projectService, "detectLanguage", "unknown"
        );
        assertEquals("unknown", unknownResult);
    }
}
