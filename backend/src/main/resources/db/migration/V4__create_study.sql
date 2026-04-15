CREATE TABLE study (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(100)  NOT NULL,
    description VARCHAR(300),
    image_url   VARCHAR(500),
    notion_url  VARCHAR(500),
    sort_order  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE study_tag (
    study_id BIGINT      NOT NULL REFERENCES study(id) ON DELETE CASCADE,
    tag      VARCHAR(50) NOT NULL
);
