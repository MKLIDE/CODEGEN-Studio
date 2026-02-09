package com.codegen.repository;

import com.codegen.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    Optional<Template> findByName(String name);
    List<Template> findByType(String type);
    List<Template> findByLanguage(String language);
    List<Template> findByActiveTrue();
}
