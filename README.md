# chaenii.me

> portfolio

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Backend  | Spring Boot 3.5, Java 17, Gradle                  |
| DB       | PostgreSQL 16, Flyway                             |
| Infra    | S3 + CloudFront (frontend), ECS Fargate (backend), RDS (DB) |

---

## Features

- **Portfolio** — 프로젝트 목록/상세 페이지, 카테고리 필터링
- **Guestbook** — 비밀번호 기반 방명록, 관리자 답글/숨김
- **Admin Dashboard** — JWT 인증, 프로젝트 CRUD, 드래그 정렬(reorder)
- **Dark Theme** — Linear.app 스타일 다크 UI
- **CI/CD** — GitHub Actions 자동 배포 (프론트/백엔드 분리)

---

## API Endpoints

### Public

| Method | Path                        | 설명                     |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/projects`             | 프로젝트 목록 (category 필터 지원) |
| GET    | `/api/projects/{slug}`      | 프로젝트 상세             |
| GET    | `/api/guestbook`            | 방명록 목록 (페이징)       |
| POST   | `/api/guestbook`            | 방명록 작성               |
| DELETE | `/api/guestbook/{id}`       | 방명록 삭제 (비밀번호 확인) |

### Auth

| Method | Path                | 설명         |
| ------ | ------------------- | ------------ |
| POST   | `/api/auth/login`   | 관리자 로그인 |
| POST   | `/api/auth/logout`  | 로그아웃      |

### Admin (ADMIN 권한 필요)

| Method | Path                           | 설명               |
| ------ | ------------------------------ | ------------------ |
| GET    | `/api/admin/projects`          | 프로젝트 목록       |
| POST   | `/api/admin/projects`          | 프로젝트 생성       |
| PUT    | `/api/admin/projects/{id}`     | 프로젝트 수정       |
| DELETE | `/api/admin/projects/{id}`     | 프로젝트 삭제       |
| PUT    | `/api/admin/projects/reorder`  | 프로젝트 순서 변경   |
| POST   | `/api/guestbook/{id}/reply`    | 방명록 답글 작성     |
| DELETE | `/api/guestbook/{id}/reply`    | 방명록 답글 삭제     |
| PATCH  | `/api/guestbook/{id}/hide`     | 방명록 숨김 처리     |

---

## Project Structure

```
chaenii/
├── .github/workflows/
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml
├── frontend/                    # Next.js App Router (static export)
│   └── src/
│       ├── app/
│       │   ├── page.tsx                  # 홈 (Hero + Projects + Guestbook)
│       │   ├── projects/[slug]/          # 프로젝트 상세
│       │   ├── admin/                    # 관리자 로그인
│       │   └── admin/dashboard/          # 관리자 대시보드
│       ├── components/
│       │   ├── ui/                       # Button, Badge, Input, Skeleton 등
│       │   ├── sections/                 # Hero, Projects, Guestbook, CurrentlyBuilding
│       │   └── layout/                   # Header, Footer
│       ├── hooks/                        # useProjects, useGuestbook, useScrollAnimation
│       ├── lib/api/                      # API 클라이언트 (client, projects, guestbook, auth, admin-projects)
│       └── types/                        # Project, Guestbook, AdminProject 타입 정의
├── backend/                     # Spring Boot (Layered Architecture)
│   ├── .env                     # 로컬 전용, git 제외
│   ├── .env.example
│   └── src/main/
│       ├── java/me/chaenii/portfolio/
│       │   ├── domain/                   # Entity, Repository 인터페이스
│       │   │   ├── Project.java
│       │   │   ├── Guestbook.java
│       │   │   ├── ProjectRepository.java
│       │   │   └── GuestbookRepository.java
│       │   ├── application/              # Service, DTO
│       │   │   ├── ProjectService.java
│       │   │   ├── GuestbookService.java
│       │   │   └── dto/
│       │   ├── infrastructure/           # JPA Repository 구현, Security, CORS
│       │   │   ├── JpaProjectRepository.java
│       │   │   ├── JpaGuestbookRepository.java
│       │   │   └── security/
│       │   │       ├── SecurityConfig.java
│       │   │       ├── JwtProvider.java
│       │   │       └── JwtAuthenticationFilter.java
│       │   └── presentation/             # Controller, ErrorCode, GlobalExceptionHandler
│       │       ├── ProjectController.java        # Public API
│       │       ├── AdminProjectController.java   # Admin API
│       │       ├── GuestbookController.java
│       │       └── AuthController.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/             # Flyway
│               ├── V1__init_schema.sql
│               └── V2__create_project.sql
├── infra/
│   ├── cf-security-headers.json
│   └── s3-bucket-policy.json
└── docker-compose.yml
```

---

## Database Schema

### project

| Column         | Type         | 설명          |
| -------------- | ------------ | ------------- |
| id             | BIGSERIAL PK | 자동 증가 ID   |
| slug           | VARCHAR(100) | URL용 고유 식별자 (UNIQUE) |
| name           | VARCHAR(100) | 프로젝트 이름   |
| category       | VARCHAR(50)  | 카테고리 (모바일앱, 백엔드, 팀 등) |
| period         | VARCHAR(50)  | 개발 기간       |
| role           | VARCHAR(100) | 담당 역할       |
| description    | VARCHAR(500) | 한줄 설명       |
| status         | VARCHAR(20)  | completed / building |
| progress       | INTEGER      | 진행률 (building일 때) |
| github_url     | VARCHAR(300) | GitHub 링크    |
| notion_url     | VARCHAR(300) | Notion 링크    |
| detail_content | TEXT         | 상세 내용 (마크다운) |
| sort_order     | INTEGER      | 정렬 순서       |
| created_at     | TIMESTAMP    | 생성일          |
| updated_at     | TIMESTAMP    | 수정일          |

### project_skill

| Column     | Type         | 설명                    |
| ---------- | ------------ | ----------------------- |
| project_id | BIGINT FK    | project.id 참조 (CASCADE) |
| skill      | VARCHAR(50)  | 기술 스택 이름            |

### guestbook

| Column     | Type         | 설명          |
| ---------- | ------------ | ------------- |
| id         | BIGSERIAL PK | 자동 증가 ID   |
| nickname   | VARCHAR(30)  | 작성자 닉네임   |
| content    | VARCHAR(500) | 내용           |
| password   | VARCHAR(72)  | BCrypt 해시    |
| reply      | VARCHAR(500) | 관리자 답글     |
| hidden     | BOOLEAN      | 숨김 여부       |
| created_at | TIMESTAMP    | 생성일          |
| updated_at | TIMESTAMP    | 수정일          |

---

## Security

- **인증**: JWT (HttpOnly Cookie, Secure, SameSite=Strict)
- **인가**: Spring Security — public 엔드포인트 외 ADMIN 권한 필요
- **CORS**: `chaenii.me`, `www.chaenii.me` 허용 (credentials 포함)
- **비밀번호**: BCrypt 해싱 (방명록), Spring Security 기본 인코딩 (관리자)
- **Rate Limiting**: API 요청 제한

---

## Local Development

```bash
# postgres only
docker compose up -d postgres

# backend — reads backend/.env automatically
cd backend && ./gradlew bootRun   # localhost:8080

# frontend
cd frontend && npm run dev        # localhost:3000
```

### backend/.env

```env
DB_URL=jdbc:postgresql://localhost:5432/chaenii
DB_USERNAME=chaenii
DB_PASSWORD=chaenii

ADMIN_USERNAME=chaenii
ADMIN_PASSWORD=your-password

JWT_SECRET=dev-secret-replace-in-production-must-be-32-chars!!

SPRING_PROFILES_ACTIVE=prod
```

Admin: `localhost:3000/admin`

---

## Frontend Deployment (S3 + CloudFront)

### 1. S3 버킷 생성

- 버킷명: `chaenii.me` (또는 원하는 이름)
- 퍼블릭 액세스 차단: **전체 차단**
- 정적 웹사이트 호스팅: 비활성화 (CloudFront OAC 사용)

### 2. CloudFront 배포 생성

- Origin: S3 버킷 (OAC 연결)
- Viewer protocol policy: Redirect HTTP to HTTPS
- Default root object: `index.html`
- **Error pages**: 403/404 → `/index.html` (HTTP 200)
- **CloudFront Function** (Viewer Request): URL rewrite — `/admin/` → `/admin/index.html` 등 SPA 라우팅 지원
- Response Headers Policy: `infra/cf-security-headers.json` 참고해서 생성

### 3. S3 버킷 정책 적용

`infra/s3-bucket-policy.json`의 `YOUR_BUCKET_NAME`, `YOUR_ACCOUNT_ID`, `YOUR_CF_DIST_ID` 를 실제 값으로 교체 후 버킷 정책에 붙여넣기.

### 4. DNS 설정 (Route 53)

```
chaenii.me     A    ALIAS → CloudFront 도메인
www.chaenii.me CNAME       chaenii.me
```

CloudFront 배포 → Alternate domain names에 `chaenii.me`, `www.chaenii.me` 추가.  
ACM 인증서는 **us-east-1** 에서 발급 (CloudFront 요구사항).

---

## Backend Deployment (ECR + ECS Fargate)

### 인프라 정보

| 항목 | 값 |
| ---- | -- |
| ECR 레포지토리 | `513244434485.dkr.ecr.ap-northeast-2.amazonaws.com/chaenii-backend` |
| ECS 클러스터 | `dearmi-cluster` |
| ECS 서비스 | `chaenii-service` |
| AWS 리전 | `ap-northeast-2` |

### ECS 태스크 정의 환경변수

ECS 태스크 정의에 아래 환경변수를 설정해야 합니다.  
민감한 값은 Secrets Manager 또는 ECS secrets 참조를 권장합니다.

```
DB_URL=jdbc:postgresql://<RDS_ENDPOINT>:5432/chaenii_db
DB_USERNAME=postgres
DB_PASSWORD=<secret>

ADMIN_USERNAME=<secret>
ADMIN_PASSWORD=<secret>

JWT_SECRET=<secret, 32자 이상>

CORS_ALLOWED_ORIGINS=https://chaenii.me,https://www.chaenii.me

SPRING_PROFILES_ACTIVE=prod
```

### 배포

`backend/**` 변경 후 `main` 브랜치에 push하면 자동 배포.

1. Docker 이미지 빌드 → ECR 푸시 (`<git-sha>` 태그 + `latest` 태그)
2. `ecs update-service --force-new-deployment` 으로 롤링 교체

---

## GitHub Secrets

| Secret                  | 용도                                    |
| ----------------------- | --------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | 프론트/백엔드 공용 IAM 키               |
| `AWS_SECRET_ACCESS_KEY` | 프론트/백엔드 공용 IAM 시크릿           |
| `S3_BUCKET`             | 프론트 S3 버킷 이름                     |
| `CF_DIST_ID`            | CloudFront 배포 ID                      |
| `NEXT_PUBLIC_API_URL`   | 백엔드 API URL (`https://...`)          |

IAM 최소 권한:
- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` — 버킷 한정
- `cloudfront:CreateInvalidation` — CF 배포 한정
- `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload` — ECR 레포 한정
- `ecs:UpdateService` — ECS 서비스 한정
