package me.chaenii.portfolio.domain;

import jakarta.persistence.*;
import me.chaenii.portfolio.presentation.ErrorCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 50)
    private String period;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(nullable = false, length = 500)
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_skill", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill", nullable = false, length = 50)
    private List<String> skills = new ArrayList<>();

    @Column(nullable = false, length = 20)
    private String status;

    private Integer progress;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "notion_url", length = 300)
    private String notionUrl;

    @Column(name = "detail_content", columnDefinition = "TEXT")
    private String detailContent;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Project() {}

    public static Project create(String slug, String name, String category, String period,
                                  String role, String description, List<String> skills,
                                  String status, Integer progress, String githubUrl,
                                  String notionUrl, String detailContent) {
        Project p = new Project();
        p.slug = slug;
        p.name = name;
        p.category = category;
        p.period = period;
        p.role = role;
        p.description = description;
        p.skills = skills != null ? new ArrayList<>(skills) : new ArrayList<>();
        p.status = status;
        p.progress = progress;
        p.githubUrl = githubUrl;
        p.notionUrl = notionUrl;
        p.detailContent = detailContent;
        p.sortOrder = 0;
        p.createdAt = LocalDateTime.now();
        p.updatedAt = LocalDateTime.now();
        return p;
    }

    public void update(String slug, String name, String category, String period,
                       String role, String description, List<String> skills,
                       String status, Integer progress, String githubUrl,
                       String notionUrl, String detailContent) {
        this.slug = slug;
        this.name = name;
        this.category = category;
        this.period = period;
        this.role = role;
        this.description = description;
        this.skills = skills != null ? new ArrayList<>(skills) : new ArrayList<>();
        this.status = status;
        this.progress = progress;
        this.githubUrl = githubUrl;
        this.notionUrl = notionUrl;
        this.detailContent = detailContent;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getPeriod() { return period; }
    public String getRole() { return role; }
    public String getDescription() { return description; }
    public List<String> getSkills() { return skills; }
    public String getStatus() { return status; }
    public Integer getProgress() { return progress; }
    public String getGithubUrl() { return githubUrl; }
    public String getNotionUrl() { return notionUrl; }
    public String getDetailContent() { return detailContent; }
    public int getSortOrder() { return sortOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
