package me.chaenii.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GuestbookRequest(
        @NotBlank @Size(max = 30)
        String nickname,

        @NotBlank @Size(max = 500)
        String content,

        @NotBlank @Size(min = 4, max = 20)
        String password,

        // 하니팟: 사람은 비워두고, 폼을 긁는 봇이 채우는 함정 필드
        String website
) {}
