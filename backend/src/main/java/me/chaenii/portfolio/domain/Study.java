package me.chaenii.portfolio.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "study")
public class Study {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 300)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "notion_url", length = 500)
    private String notionUrl;

    @Column(length = 50)
    private String period;

    @ElementCollection
    @CollectionTable(name = "study_tag", joinColumns = @JoinColumn(name = "study_id"))
    @Column(name = "tag", nullable = false, length = 50)
    private List<String> tags = new ArrayList<>();

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Study() {}

    public static Study create(String title, String description, String imageUrl,
                                String notionUrl, List<String> tags, String period) {
        Study s = new Study();
        s.title = title;
        s.description = description;
        s.imageUrl = imageUrl;
        s.notionUrl = notionUrl;
        s.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
        s.period = period;
        s.sortOrder = 0;
        s.createdAt = LocalDateTime.now();
        s.updatedAt = LocalDateTime.now();
        return s;
    }

    public void update(String title, String description, String imageUrl,
                       String notionUrl, List<String> tags, String period) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.notionUrl = notionUrl;
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
        this.period = period;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public String getNotionUrl() { return notionUrl; }
    public List<String> getTags() { return tags; }
    public String getPeriod() { return period; }
    public int getSortOrder() { return sortOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
