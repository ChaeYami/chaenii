package me.chaenii.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProjectRequest(
        @NotBlank @Size(max = 100) String slug,
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 50) String category,
        @NotBlank @Size(max = 50) String period,
        @NotBlank @Size(max = 100) String role,
        @NotBlank @Size(max = 500) String description,
        List<String> skills,
        @NotBlank @Size(max = 20) String status,
        Integer progress,
        @Size(max = 300) String githubUrl,
        @Size(max = 300) String notionUrl,
        String detailContent,
        @Size(max = 500) String coverImageUrl,
        @Size(max = 300) String serviceUrl,
        @Size(max = 300) String appStoreUrl,
        @Size(max = 300) String playStoreUrl
) {}
