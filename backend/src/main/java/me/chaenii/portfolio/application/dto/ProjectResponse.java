package me.chaenii.portfolio.application.dto;

import me.chaenii.portfolio.domain.Project;

import java.util.List;

public record ProjectResponse(
        Long id,
        String slug,
        String name,
        String category,
        String period,
        String role,
        String description,
        List<String> skills,
        String status,
        Integer progress,
        String githubUrl,
        String notionUrl,
        String detailContent,
        int sortOrder
) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getSlug(),
                project.getName(),
                project.getCategory(),
                project.getPeriod(),
                project.getRole(),
                project.getDescription(),
                project.getSkills(),
                project.getStatus(),
                project.getProgress(),
                project.getGithubUrl(),
                project.getNotionUrl(),
                project.getDetailContent(),
                project.getSortOrder()
        );
    }
}
