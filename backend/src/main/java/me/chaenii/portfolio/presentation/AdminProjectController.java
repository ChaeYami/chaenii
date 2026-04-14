package me.chaenii.portfolio.presentation;

import jakarta.validation.Valid;
import me.chaenii.portfolio.application.ProjectService;
import me.chaenii.portfolio.application.dto.ProjectRequest;
import me.chaenii.portfolio.application.dto.ProjectResponse;
import me.chaenii.portfolio.application.dto.ReorderRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<ProjectResponse>> list() {
        return ApiResponse.ok(projectService.getProjects(null));
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

    @PutMapping("/reorder")
    public ApiResponse<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        projectService.reorder(request.ids());
        return ApiResponse.ok();
    }
}
