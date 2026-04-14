CREATE TABLE project (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(100)  NOT NULL UNIQUE,
    name            VARCHAR(100)  NOT NULL,
    category        VARCHAR(50)   NOT NULL,
    period          VARCHAR(50)   NOT NULL,
    role            VARCHAR(100)  NOT NULL,
    description     VARCHAR(500)  NOT NULL,
    status          VARCHAR(20)   NOT NULL,
    progress        INTEGER,
    github_url      VARCHAR(300),
    notion_url      VARCHAR(300),
    detail_content  TEXT,
    sort_order      INTEGER       NOT NULL DEFAULT 0,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE project_skill (
    project_id  BIGINT      NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    skill       VARCHAR(50) NOT NULL
);

CREATE INDEX idx_project_category ON project (category);
CREATE INDEX idx_project_sort_order ON project (sort_order);
CREATE INDEX idx_project_slug ON project (slug);
