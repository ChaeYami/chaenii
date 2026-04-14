package me.chaenii.portfolio.presentation;

import jakarta.validation.Valid;
import me.chaenii.portfolio.application.ProjectService;
import me.chaenii.portfolio.application.dto.ProjectRequest;
import me.chaenii.portfolio.application.dto.ProjectResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<ProjectResponse>> list(@RequestParam(required = false) String category) {
        return ApiResponse.ok(projectService.getProjects(category));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ProjectResponse> detail(@PathVariable String slug) {
        return ApiResponse.ok(projectService.getProject(slug));
    }

    @PostMapping
    public ApiResponse<ProjectResponse> create(@Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProjectResponse> update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ApiResponse.ok();
    }
}
