package me.chaenii.portfolio.application.dto;

import jakarta.validation.constraints.NotBlank;

public record GuestbookDeleteRequest(
        @NotBlank String password
) {}
