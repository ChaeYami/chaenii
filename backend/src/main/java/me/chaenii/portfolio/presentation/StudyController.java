package me.chaenii.portfolio.presentation;

import me.chaenii.portfolio.application.StudyService;
import me.chaenii.portfolio.application.dto.StudyResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studies")
public class StudyController {

    private final StudyService studyService;

    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @GetMapping
    public ApiResponse<List<StudyResponse>> list() {
        return ApiResponse.ok(studyService.getStudies());
    }
}
