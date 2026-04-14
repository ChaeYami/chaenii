package me.chaenii.portfolio.application.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReorderRequest(
        @NotNull List<Long> ids
) {}
