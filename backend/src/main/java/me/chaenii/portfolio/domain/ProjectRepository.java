package me.chaenii.portfolio.domain;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {

    Project save(Project project);

    Optional<Project> findById(Long id);

    Optional<Project> findBySlug(String slug);

    List<Project> findAll();

    List<Project> findAllByOrderBySortOrderAsc();

    List<Project> findByCategory(String category);

    List<Project> findByCategoryOrderBySortOrderAsc(String category);

    void delete(Project project);
}
