# chaenii.me

Portfolio site. Linear.app mood dark theme.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS              |
| Backend  | Spring Boot 3.5, Java 17, Gradle                  |
| DB       | PostgreSQL 16, Flyway                             |
| Infra    | S3 + CloudFront (frontend), ECS Fargate (backend) |

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

---

## Project Structure

```
chaenii/
├── .github/workflows/
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml
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
│   ├── .env               # 로컬 전용, git 제외
│   ├── .env.example
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
