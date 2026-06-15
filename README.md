# chaenii.me

> 디자인 · 프론트엔드 · 백엔드 · 인프라 **풀스택 포트폴리오 사이트**

[![Live](https://img.shields.io/badge/Live-chaenii.me-7C5CFF)](https://chaenii.me)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-S3_·_CloudFront_·_ECS-FF9900?logo=amazonaws&logoColor=white)

프로젝트를 나열하기만 하는 정적 포트폴리오가 아니라, **직접 운영하는 서비스**로 제작.  
- 프로젝트·방명록·스터디 기록을 관리자 페이지에서 직접 CRUD
- 마크다운으로 상세 페이지 작성 및 이미지 첨부
- 방명록 스팸 걸러내기
> 작지만 끝까지 굴러가는 프로덕션을 목표로.  

🔗 **Live:** [chaenii.me](https://chaenii.me) · 관리자 페이지(`/admin`)는 비공개

---

## ✨ 이 프로젝트에서 보여주고 싶은 것

- **레이어드 + 의존성 역전 아키텍처** — `domain`이 인터페이스를 정의하고 `infrastructure`가 구현. 도메인이 JPA·프레임워크를 모르도록 격리.
- **정적 호스팅의 한계를 우회한 개발 환경** — 운영은 S3 정적 export, 로컬 dev는 Next rewrites 프록시로 같은 출처 요청을 만들어 **CORS 없이** 운영 백엔드에 붙음.
- **쿠키 기반 JWT 인증** — 토큰을 JS에서 못 읽는 `HttpOnly` + `Secure` + `SameSite` 쿠키로 관리해 XSS로부터 토큰을 보호.
- **방명록 어뷰징 방어** — IP 기반 Rate Limiting + 스팸 패턴 탐지 + BCrypt 비밀번호로 익명 작성/삭제를 안전하게.
- **콘텐츠를 위한 작은 CMS** — 마크다운 에디터, S3 이미지 업로드(커서 위치 삽입·붙여넣기), 드래그로 프로젝트 순서 변경.
- **CI/CD 분리 배포** — 프론트(S3+CloudFront)와 백엔드(ECR+ECS Fargate)를 GitHub Actions로 경로 변경 기반 자동 배포.

---

## 🛠 Tech Stack

| Layer        | Tech                                                                 |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | Next.js 14 (App Router, 정적 export) · TypeScript · Tailwind CSS · Framer Motion |
| **State/Data** | TanStack Query · Zod · dnd-kit(드래그 정렬) · react-markdown + @uiw/react-md-editor |
| **Backend**  | Spring Boot 3.5 · Java 17 · Spring Security · Spring Data JPA · Gradle |
| **Database** | PostgreSQL 16 · Flyway(마이그레이션)                                  |
| **Infra**    | AWS S3 + CloudFront(프론트) · ECR + ECS Fargate(백엔드) · RDS · S3(이미지) |
| **CI/CD**    | GitHub Actions(프론트/백엔드 분리 배포)                              |

---

## 🏗 Architecture

```
                  ┌──────────────────────────────┐
   브라우저  ──►  │  CloudFront (HTTPS, 보안헤더)  │
                  │  └─ S3  (Next.js 정적 export)  │
                  └──────────────┬───────────────┘
                                 │  /api/*  (XHR)
                                 ▼
                  ┌──────────────────────────────┐
                  │  ECS Fargate (Spring Boot)    │
                  │  presentation → application   │
                  │       → domain ← infrastructure│
                  └───────┬───────────────┬───────┘
                          │               │
                    ┌─────▼─────┐   ┌─────▼─────┐
                    │ RDS (PG)  │   │ S3(이미지) │
                    └───────────┘   └───────────┘
```

### 백엔드 레이어 구조 (의존성 역전)

```
presentation/    Controller · ApiResponse · ErrorCode · GlobalExceptionHandler
      ▼
application/      Service · DTO          ← 유스케이스 / 트랜잭션 경계
      ▼
domain/           Entity · Repository(인터페이스) · DomainException   ← 순수 도메인, 프레임워크 무지(無知)
      ▲
infrastructure/   JpaXxxRepository(구현) · security · S3ImageService · spam · RateLimit
```

`domain`은 `ProjectRepository` 같은 **인터페이스만** 정의하고, 실제 JPA 구현은 `infrastructure`에 둡니다.
의존성이 도메인 안쪽을 향하게 만들어 비즈니스 로직을 인프라 교체로부터 분리했습니다.

---

## 🔍 핵심 구현 포인트

### 1. 정적 export + dev 프록시로 CORS 없애기
- 운영 프론트는 S3에 올라가는 **정적 파일**이라 서버 사이드 프록시가 없습니다. 그래서 로컬 개발에선
`next.config.mjs`가 환경에 따라 갈라집니다  
- dev에서는 `output: export`를 끄고 `rewrites`로 `/api/*`를
운영 백엔드로 프록시. 브라우저는 항상 같은 출처(`localhost`)로 요청하므로 **CORS preflight 자체가 사라집니다.**

### 2. HttpOnly 쿠키 JWT 인증
- 로그인 시 발급한 JWT를 응답 바디가 아닌 `HttpOnly · Secure · SameSite` 쿠키로
- JS에서 토큰을 읽을 수 없어 XSS 탈취를 막고, 프론트는 `credentials: 'include'`로 자동 인증.
- `JwtAuthenticationFilter`가 모든 요청에서 쿠키를 검증하고 `SecurityConfig`가 public/admin 경로를 분리합니다.

### 3. 익명 방명록을 안전하게
- **Rate Limiting** — `RateLimitInterceptor` + `ClientIpResolver`로 IP당 요청 빈도 제한
- **스팸 탐지** — `SpamDetector`가 작성 패턴을 검사
- **비밀번호** — BCrypt 해시로 저장, 본인만 삭제 가능 (관리자는 답글/숨김)

### 4. 콘텐츠 작성 경험
- 관리자 대시보드에 마크다운 에디터
- 이미지를 **붙여넣기/파일 첨부 시 커서 위치에 삽입**하도록
- 업로드는 `S3ImageService`로 처리해 URL을 돌려받고,
- 상세 페이지는 `react-markdown`으로
렌더링(코드 하이라이트·표·인용·이미지 크기 제한·플로팅 목차 포함).

### 5. 드래그로 정렬
프로젝트 노출 순서를 `dnd-kit`으로 드래그해 바꾸고, `PUT /api/admin/projects/reorder`로 `sort_order`를 일괄 갱신.

---

## 📦 주요 기능

- **Portfolio** — 프로젝트 목록/상세(마크다운), 카테고리 필터, 커버 이미지, 서비스/스토어/GitHub 링크
- **Guestbook** — 익명 방명록, 비밀번호 삭제, 관리자 답글·숨김, 스팸/레이트리밋 방어
- **Study** — 학습 기록 섹션
- **Admin Dashboard** — JWT 로그인, 프로젝트·스터디·방명록 관리, 드래그 정렬, 이미지 업로드
- **Dark UI** — Linear.app 스타일 다크 테마 + Framer Motion 스크롤 애니메이션

---

## 🗄 Data Model

`project` · `project_skill` · `guestbook` · `study` 4개 테이블. 스키마 변경은 모두 Flyway로 버전 관리.

```
backend/src/main/resources/db/migration/
├── V1__init_schema.sql           # guestbook
├── V2__create_project.sql        # project + project_skill
├── V3__add_cover_image_to_project.sql
├── V4__create_study.sql
├── V5__add_period_to_study.sql
└── V6__add_service_urls_to_project.sql
```

---

## 🚀 Local Development

```bash
# 1. DB
docker compose up -d postgres

# 2. Backend (localhost:8080) — backend/.env 자동 로드
cd backend && ./gradlew bootRun

# 3. Frontend (localhost:3000)
cd frontend && npm install && npm run dev
```

`backend/.env` 는 `backend/.env.example` 참고. 관리자 페이지는 `localhost:3000/admin`.

> 프론트만 빠르게 보고 싶으면 백엔드 없이 `npm run dev` — dev 프록시가 `/api/*`를 운영 백엔드(`https://api.chaenii.me`)로 넘깁니다. (`DEV_API_PROXY_TARGET`로 로컬 백엔드 지정 가능)

---

## ☁️ Deployment

`main` 브랜치 push 시 변경 경로에 따라 GitHub Actions가 자동 배포합니다.

| 변경 경로      | 파이프라인                                                      |
| -------------- | -------------------------------------------------------------- |
| `frontend/**`  | `next build` → S3 동기화 → CloudFront 무효화                    |
| `backend/**`   | Docker 빌드 → ECR 푸시(`<git-sha>` + `latest`) → ECS 롤링 배포 |

<details>
<summary>인프라 상세 / 최초 셋업 가이드</summary>

### Frontend (S3 + CloudFront)
- S3: 퍼블릭 차단 + CloudFront **OAC**로만 접근
- CloudFront: HTTP→HTTPS 리다이렉트, 403/404 → `/index.html`(200)로 SPA 라우팅, Viewer Function으로 URL rewrite
- 보안 헤더: `infra/cf-security-headers.json`, 버킷 정책: `infra/s3-bucket-policy.json`
- DNS(Route 53): `chaenii.me` A ALIAS → CloudFront, ACM 인증서는 **us-east-1** 발급

### Backend (ECR + ECS Fargate)
| 항목 | 값 |
| ---- | -- |
| ECR | `…/chaenii-backend` |
| 리전 | `ap-northeast-2` |

ECS 태스크 정의 환경변수 (민감값은 Secrets Manager 권장):

```env
DB_URL=jdbc:postgresql://<RDS_ENDPOINT>:5432/chaenii_db
DB_USERNAME=...   DB_PASSWORD=<secret>
ADMIN_USERNAME=<secret>   ADMIN_PASSWORD=<secret>
JWT_SECRET=<secret, 32자 이상>
CORS_ALLOWED_ORIGINS=https://chaenii.me,https://www.chaenii.me
SPRING_PROFILES_ACTIVE=prod
```

### GitHub Secrets
`AWS_ACCESS_KEY_ID` · `AWS_SECRET_ACCESS_KEY` · `S3_BUCKET` · `CF_DIST_ID` · `NEXT_PUBLIC_API_URL`
(IAM은 S3/CloudFront/ECR/ECS 최소 권한으로 제한)

</details>

---

## 📂 Project Structure

```
chaenii/
├── frontend/                     # Next.js App Router (정적 export)
│   └── src/
│       ├── app/                  # 홈 · projects/[slug] · admin · admin/dashboard
│       ├── components/           # ui · sections · layout
│       ├── hooks/                # useProjects · useGuestbook · …
│       ├── lib/api/              # API 클라이언트
│       └── types/                # 도메인 타입
├── backend/                      # Spring Boot (Layered + 의존성 역전)
│   └── src/main/java/me/chaenii/portfolio/
│       ├── domain/               # Entity · Repository 인터페이스
│       ├── application/          # Service · DTO
│       ├── infrastructure/       # JPA 구현 · security · S3 · spam · ratelimit
│       └── presentation/         # Controller · 예외 처리
├── infra/                        # CloudFront / S3 정책
├── .github/workflows/            # deploy-frontend · deploy-backend
└── docker-compose.yml
```

---

## 📡 API

| 구분   | 대표 엔드포인트 |
| ------ | --------------- |
| Public | `GET /api/projects` · `GET /api/projects/{slug}` · `GET·POST /api/guestbook` · `GET /api/study` |
| Auth   | `POST /api/auth/login` · `POST /api/auth/logout` |
| Admin  | `…/api/admin/projects` (CRUD) · `PUT …/projects/reorder` · `POST /api/admin/images` · 방명록 reply/hide |

<sub>Built by <b>Chaeyeon Seo</b> · 1인 풀스택</sub>
