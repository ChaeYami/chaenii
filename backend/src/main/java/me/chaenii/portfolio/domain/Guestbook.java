package me.chaenii.portfolio.domain;

import jakarta.persistence.*;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;

@Entity
@Table(name = "guestbook")
public class Guestbook {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false, length = 72)
    private String password;

    @Column(length = 500)
    private String reply;

    @Column(nullable = false)
    private boolean hidden;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Guestbook() {}

    public static Guestbook create(String nickname, String content, String rawPassword) {
        Guestbook g = new Guestbook();
        g.nickname = nickname;
        g.content = content;
        g.password = PASSWORD_ENCODER.encode(rawPassword);
        g.hidden = false;
        g.createdAt = LocalDateTime.now();
        g.updatedAt = LocalDateTime.now();
        return g;
    }

    public void validateOwnership(String rawPassword) {
        if (!PASSWORD_ENCODER.matches(rawPassword, this.password)) {
            throw new DomainException(ErrorCode.C001);
        }
    }

    public void addReply(String reply) {
        if (this.reply != null) {
            throw new DomainException(ErrorCode.C003);
        }
        this.reply = reply;
        this.updatedAt = LocalDateTime.now();
    }

    public void removeReply() {
        this.reply = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void hide() {
        this.hidden = true;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNickname() { return nickname; }
    public String getContent() { return content; }
    public String getReply() { return reply; }
    public boolean isHidden() { return hidden; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
