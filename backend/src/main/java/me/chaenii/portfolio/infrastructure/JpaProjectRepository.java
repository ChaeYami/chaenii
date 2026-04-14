package me.chaenii.portfolio.infrastructure;

import me.chaenii.portfolio.domain.Project;
import me.chaenii.portfolio.domain.ProjectRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaProjectRepository extends JpaRepository<Project, Long>, ProjectRepository {

    @Override
    Optional<Project> findBySlug(String slug);

    @Override
    List<Project> findAllByOrderBySortOrderAsc();

    @Override
    List<Project> findByCategory(String category);

    @Override
    List<Project> findByCategoryOrderBySortOrderAsc(String category);
}
