package me.chaenii.portfolio.presentation;

import jakarta.validation.Valid;
import me.chaenii.portfolio.application.StudyService;
import me.chaenii.portfolio.application.dto.ReorderRequest;
import me.chaenii.portfolio.application.dto.StudyRequest;
import me.chaenii.portfolio.application.dto.StudyResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/studies")
public class AdminStudyController {

    private final StudyService studyService;

    public AdminStudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @GetMapping
    public ApiResponse<List<StudyResponse>> list() {
        return ApiResponse.ok(studyService.getStudies());
    }

    @PostMapping
    public ApiResponse<StudyResponse> create(@Valid @RequestBody StudyRequest request) {
        return ApiResponse.ok(studyService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<StudyResponse> update(@PathVariable Long id, @Valid @RequestBody StudyRequest request) {
        return ApiResponse.ok(studyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        studyService.delete(id);
        return ApiResponse.ok();
    }

    @PutMapping("/reorder")
    public ApiResponse<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        studyService.reorder(request.ids());
        return ApiResponse.ok();
    }
}
