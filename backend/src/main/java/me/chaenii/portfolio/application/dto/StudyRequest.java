package me.chaenii.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StudyRequest(
        @NotBlank @Size(max = 100) String title,
        @Size(max = 300) String description,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String notionUrl,
        List<String> tags,
        @Size(max = 50) String period
) {}
