package me.chaenii.portfolio.application;

import me.chaenii.portfolio.application.dto.ProjectRequest;
import me.chaenii.portfolio.application.dto.ProjectResponse;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.domain.Project;
import me.chaenii.portfolio.domain.ProjectRepository;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getProjects(String category) {
        List<Project> projects = (category == null || category.isBlank())
                ? projectRepository.findAllByOrderBySortOrderAsc()
                : projectRepository.findByCategoryOrderBySortOrderAsc(category);
        return projects.stream().map(ProjectResponse::from).toList();
    }

    public ProjectResponse getProject(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new DomainException(ErrorCode.P001));
        return ProjectResponse.from(project);
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        Project project = Project.create(
                request.slug(), request.name(), request.category(), request.period(),
                request.role(), request.description(), request.skills(),
                request.status(), request.progress(), request.githubUrl(),
                request.notionUrl(), request.detailContent()
        );
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = findOrThrow(id);
        project.update(
                request.slug(), request.name(), request.category(), request.period(),
                request.role(), request.description(), request.skills(),
                request.status(), request.progress(), request.githubUrl(),
                request.notionUrl(), request.detailContent()
        );
        return ProjectResponse.from(project);
    }

    @Transactional
    public void delete(Long id) {
        Project project = findOrThrow(id);
        projectRepository.delete(project);
    }

    @Transactional
    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Project project = findOrThrow(ids.get(i));
            project.updateSortOrder(i);
        }
    }

    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new DomainException(ErrorCode.P001));
    }
}
