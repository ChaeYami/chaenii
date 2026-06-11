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
) {
    // 선택 입력 필드는 빈 문자열("") 대신 null로 정규화한다.
    // ""로 저장되면 프론트의 ?? (nullish) 분기가 "값 있음"으로 오판해 카드 링크가 깨진다.
    public ProjectRequest {
        githubUrl = blankToNull(githubUrl);
        notionUrl = blankToNull(notionUrl);
        detailContent = blankToNull(detailContent);
        coverImageUrl = blankToNull(coverImageUrl);
        serviceUrl = blankToNull(serviceUrl);
        appStoreUrl = blankToNull(appStoreUrl);
        playStoreUrl = blankToNull(playStoreUrl);
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
