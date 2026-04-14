# chaenii.me

Portfolio site. Linear.app mood dark theme.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS              |
| Backend  | Spring Boot 3.5, Java 17, Gradle                  |
| DB       | PostgreSQL 16, Flyway                             |
| Infra    | S3 + CloudFront (frontend), Docker (backend)      |

---

## Local Development

```bash
# postgres only
docker compose up -d postgres

# backend
cd backend && ./gradlew bootRun   # localhost:8080

# frontend
cd frontend && npm run dev        # localhost:3000
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
- **Error pages**: 404 → `/index.html` (HTTP 200)
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

### 5. GitHub Secrets 등록

| Secret                  | 값                          |
| ----------------------- | --------------------------- |
| `AWS_ACCESS_KEY_ID`     | IAM 액세스 키               |
| `AWS_SECRET_ACCESS_KEY` | IAM 시크릿 키               |
| `S3_BUCKET`             | 버킷 이름                   |
| `CF_DIST_ID`            | CloudFront 배포 ID          |
| `NEXT_PUBLIC_API_URL`   | 백엔드 API URL (https://...)  |

IAM 정책 최소 권한:
- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` — 버킷 한정
- `cloudfront:CreateInvalidation` — 배포 한정

### 6. 배포

`frontend/**` 변경 후 `main` 브랜치에 push하면 자동 배포.

---

## Project Structure

```
chaenii/
├── .github/workflows/
│   └── deploy-frontend.yml
├── frontend/              # Next.js App Router (static export)
│   └── src/
│       ├── app/
│       ├── components/
│       │   ├── ui/
│       │   ├── sections/
│       │   └── layout/
│       ├── hooks/
│       ├── lib/
│       └── types/
├── backend/               # Spring Boot
│   └── src/main/java/me/chaenii/portfolio/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── infra/
│   ├── cf-security-headers.json
│   └── s3-bucket-policy.json
└── docker-compose.yml
```
