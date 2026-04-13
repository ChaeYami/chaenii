CREATE TABLE guestbook (
    id          BIGSERIAL PRIMARY KEY,
    nickname    VARCHAR(30)  NOT NULL,
    content     VARCHAR(500) NOT NULL,
    password    VARCHAR(72)  NOT NULL,
    reply       VARCHAR(500),
    hidden      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_guestbook_created_at ON guestbook (created_at DESC);
CREATE INDEX idx_guestbook_hidden ON guestbook (hidden);
