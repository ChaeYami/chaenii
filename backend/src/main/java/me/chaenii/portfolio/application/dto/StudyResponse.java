package me.chaenii.portfolio.application.dto;

import me.chaenii.portfolio.domain.Study;

import java.util.List;

public record StudyResponse(
        Long id,
        String title,
        String description,
        String imageUrl,
        String notionUrl,
        List<String> tags,
        int sortOrder
) {
    public static StudyResponse from(Study study) {
        return new StudyResponse(
                study.getId(),
                study.getTitle(),
                study.getDescription(),
                study.getImageUrl(),
                study.getNotionUrl(),
                List.copyOf(study.getTags()),
                study.getSortOrder()
        );
    }
}
