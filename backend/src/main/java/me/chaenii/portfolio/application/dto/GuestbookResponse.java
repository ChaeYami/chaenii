package me.chaenii.portfolio.application.dto;

import me.chaenii.portfolio.domain.Guestbook;

import java.time.LocalDateTime;

public record GuestbookResponse(
        Long id,
        String nickname,
        String content,
        String reply,
        LocalDateTime createdAt
) {
    public static GuestbookResponse from(Guestbook g) {
        return new GuestbookResponse(
                g.getId(),
                g.getNickname(),
                g.getContent(),
                g.getReply(),
                g.getCreatedAt()
        );
    }
}
