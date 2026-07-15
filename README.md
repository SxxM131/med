# Med - 개인 맞춤형 복약 안전성 확인 웹 애플리케이션

약물 알러지와 복용 경험을 기반으로 개인 맞춤형 복약 안전성을 확인할 수 있는 풀스택 웹 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [데이터베이스 설정](#데이터베이스-설정)
- [API 문서](#api-문서)
- [배포 가이드](#배포-가이드)
- [HTTPS 설정](#https-설정)
- [문제 해결](#문제-해결)

---

## 프로젝트 개요

Med는 사용자의 알러지 정보와 복용 경험을 기반으로 안전한 약물을 추천하고 분석하는 웹 애플리케이션입니다. 

### 시스템 아키텍처

```
┌─────────────┐
│   React FE   │ (Vite + TypeScript + Tailwind CSS)
│  localhost:3000 │
└──────┬──────┘
       │ HTTP/REST
       │ JWT Authentication
┌──────▼──────┐
│ Spring Boot │ (Java 17 + Spring Boot 3.3.5)
│  localhost:8080 │
└──────┬──────┘
       │
       ├──► PostgreSQL (로컬 또는 Supabase)
       │
       └──► Python FastAPI (분석 서비스)
            localhost:8000
```

---

## 주요 기능

### 1. 사용자 인증 및 관리
- 회원가입 및 로그인
- JWT 기반 인증
- 사용자 정보 관리 (닉네임 변경, 비밀번호 변경)
- 아이디 찾기 (이메일 발송)

### 2. 알러지 관리
- 복용하면 안 되는 성분(알러지 성분) 등록 및 관리
- 약물 알러지 / 식품 알러지 구분
- 식품 알러지 카테고리 (7개 그룹):
  - 견과류 (땅콩 등)
  - 우유 · 계란
  - 수산물
  - 곡류 · 글루텐
  - 대두
  - 씨앗류 (참깨 등)
  - 기타
- 심각도 설정 (경미/보통/심각)
- 모든 분석 기능에서 자동으로 알러지 정보 참조

### 3. 증상 분석
- 현재 겪고 있는 증상을 텍스트로 입력
- GPT-4o-mini 기반 약물 추천 및 주의사항 제공
- 알러지 성분과 매칭하여 안전한 약 추천
- "추천 가능한 약", "주의해야 할 약", "위험 요소 요약" 제공

### 4. 부작용 분석
- 이전에 복용했을 때 부작용이 있었던 약물명 입력
- 공통 성분 및 부작용 위험 성분 분석
- "당신이 민감할 가능성이 높은 성분" 분석
- "다른 사용자에게도 부작용이 많은 성분" 분석
- 식품 알러지 기반 부형제 위험도 평가

### 5. OCR 성분표 분석
- 약 성분표 사진 업로드
- Google Vision API를 통한 OCR 텍스트 추출
- GPT 기반 위험도 분석
- "복용 가능", "주의 필요", "고위험 성분 포함" 등 레이블 제공
- 식품 알러지 관련 부형제 자동 감지

### 6. 커뮤니티
- 게시글 작성, 수정, 삭제
- 댓글 작성, 수정, 삭제
- 좋아요 기능
- 카테고리별 필터링
- 페이지네이션

---

## 기술 스택

### Frontend (medFE)
- **프레임워크**: React 18.2.0
- **언어**: TypeScript 5.2.2
- **빌드 도구**: Vite 5.0.8
- **스타일링**: Tailwind CSS 3.3.6
- **상태 관리**: Zustand 4.4.7
- **HTTP 클라이언트**: Axios 1.6.2
- **라우팅**: React Router v6 6.20.0

### Backend (medBE)
- **프레임워크**: Spring Boot 3.3.5
- **언어**: Java 17
- **빌드 도구**: Gradle
- **데이터베이스**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **인증**: JWT (jjwt 0.12.3)
- **보안**: Spring Security
- **API 문서**: Springdoc OpenAPI (Swagger)
- **외부 API**:
  - OpenAI GPT-4o-mini (약물 분석)
  - Google Cloud Vision API (OCR)

### Analysis Service (medPY)
- **프레임워크**: FastAPI 0.115.0
- **언어**: Python 3.9+
- **서버**: Uvicorn
- **HTTP 클라이언트**: httpx
- **데이터 검증**: Pydantic

### Database
- **PostgreSQL** (로컬 또는 Supabase 관리형)
- **접속 방식**: 환경변수 `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` (하드코딩 없음)
- **로컬 개발**: 로컬 DB와 Supabase 둘 다 가능 — `DB_URL`만 바꾸면 됩니다

---

## 프로젝트 구조

```
med/
├── medFE/                    # 프론트엔드 (React + TypeScript)
│   ├── src/
│   │   ├── api/              # API 클라이언트
│   │   │   ├── client.ts     # Axios 인스턴스 및 인터셉터
│   │   │   ├── auth.ts       # 인증 API
│   │   │   ├── users.ts      # 사용자 및 알러지 API
│   │   │   ├── posts.ts      # 게시글 API
│   │   │   ├── comments.ts   # 댓글 API
│   │   │   ├── analysis.ts   # 분석 API
│   │   │   └── images.ts     # 이미지 업로드 API
│   │   ├── components/       # 공통 컴포넌트
│   │   │   └── Layout.tsx    # 레이아웃 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── AllergiesPage.tsx
│   │   │   ├── SymptomAnalysisPage.tsx
│   │   │   ├── SideEffectAnalysisPage.tsx
│   │   │   ├── OcrAnalysisPage.tsx
│   │   │   ├── PostsListPage.tsx
│   │   │   ├── PostCreatePage.tsx
│   │   │   ├── PostDetailPage.tsx
│   │   │   └── MyPage.tsx
│   │   ├── store/            # 상태 관리
│   │   │   └── authStore.ts  # 인증 상태 관리
│   │   ├── types/            # TypeScript 타입 정의
│   │   │   └── api.ts
│   │   ├── App.tsx           # 메인 앱 컴포넌트
│   │   └── main.tsx          # 진입점
│   ├── package.json
│   └── vite.config.ts
│
├── medBE/                    # 백엔드 (Spring Boot)
│   ├── src/main/java/com/sxxm/med/
│   │   ├── auth/             # 인증 모듈
│   │   │   ├── controller/   # AuthController, UserController
│   │   │   ├── service/      # AuthService, UserService, PasswordService, EmailService
│   │   │   ├── entity/       # User, UserAllergy
│   │   │   ├── repository/   # UserRepository, UserAllergyRepository
│   │   │   └── dto/          # Request/Response DTOs
│   │   ├── analysis/         # 분석 모듈
│   │   │   ├── controller/   # AnalysisController
│   │   │   ├── service/      # SymptomAnalysisService, SideEffectAnalysisService, AllergyService
│   │   │   └── dto/          # Analysis DTOs
│   │   ├── ocr/              # OCR 모듈
│   │   │   ├── controller/   # OcrController
│   │   │   ├── service/      # OcrAnalysisService
│   │   │   ├── entity/       # OcrIngredient
│   │   │   └── dto/          # Ocr DTOs
│   │   ├── community/        # 커뮤니티 모듈
│   │   │   ├── controller/   # PostController, CommentController
│   │   │   ├── service/      # PostService, CommentService
│   │   │   ├── entity/       # Post, Comment, PostLike, CommentLike
│   │   │   └── dto/          # Community DTOs
│   │   ├── config/           # 설정 클래스
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   └── WebClientConfig.java
│   │   └── security/         # 보안 필터
│   │       └── JwtAuthenticationFilter.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-prod.properties
│   │   └── db/
│   │       └── schema.sql    # 데이터베이스 스키마
│   └── build.gradle
│
└── medPY/                    # 분석 서비스 (Python FastAPI)
    ├── app/
    │   ├── main.py           # FastAPI 앱 진입점
    │   ├── routers/          # API 라우터
    │   │   ├── ingredients.py    # 성분 분석
    │   │   ├── sideeffects.py   # 부작용 분석
    │   │   └── ocr.py           # OCR 정규화
    │   ├── services/         # 비즈니스 로직
    │   │   ├── gpt_service.py      # GPT API 호출
    │   │   ├── ingredient_service.py  # 성분 분석 서비스
    │   │   ├── sideeffect_service.py  # 부작용 분석 서비스
    │   │   ├── ocr_service.py        # OCR 서비스
    │   │   └── allergy_mapper.py     # 식품 알러지 매핑
    │   └── models/           # Pydantic 모델
    │       ├── ingredient_analysis.py
    │       └── sideeffect_analysis.py
    ├── requirements.txt
    └── start.sh
```

---

## 시작하기

### 필수 요구사항

- **Node.js** 18 이상
- **Java** 17 이상
- **Python** 3.9 이상
- **PostgreSQL** 12 이상
- **npm** 또는 **yarn**

### 1. 데이터베이스 설정

로컬 PostgreSQL과 Supabase를 **둘 다** 사용할 수 있습니다. properties에 값을 넣지 말고, `DB_URL`만 바꾸면 됩니다.  
자세한 Supabase 절차는 [`medBE/README.md`](./medBE/README.md)를 참고하세요.

#### 로컬 PostgreSQL 사용

```bash
# 스크립트로 DB/유저 생성 (선택)
./medBE/scripts/setup-local-db.sh

# 또는 수동
psql -U postgres -c 'CREATE DATABASE "localMED_DB";'
psql -U postgres -d localMED_DB -f medBE/src/main/resources/db/schema.sql
```

환경 변수 예:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/localMED_DB
export DB_USERNAME=sxxm
export DB_PASSWORD=your_local_password
```

#### Supabase 사용

1. [Supabase](https://supabase.com)에서 프로젝트 생성  
2. **Project Settings → Database**에서 Direct connection 정보 확인  
3. 환경변수 등록:

```bash
export DB_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres
export DB_USERNAME=postgres
export DB_PASSWORD=your_supabase_db_password
```

4. SQL Editor 또는 `psql`로 `medBE/src/main/resources/db/schema.sql` 적용  

### 2. Python 분석 서비스 실행

```bash
cd medPY

# 가상 환경 생성 (처음 한 번만)
python -m venv venv

# 가상 환경 활성화
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일 생성)
echo "OPENAI_API_KEY=your_openai_api_key" > .env
echo "GPT_MODEL=gpt-4o-mini" >> .env

# 서비스 실행
uvicorn app.main:app --reload --port 8000
```

Python 서비스는 `http://localhost:8000`에서 실행됩니다.

**FastAPI 문서**:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. 백엔드 실행

```bash
cd medBE

# 환경 변수 설정 (필수) — 또는 cp .env.example .env 후 source
export DB_URL=jdbc:postgresql://localhost:5432/localMED_DB
export DB_USERNAME=sxxm
export DB_PASSWORD=your_db_password
export JWT_SECRET=your_jwt_secret_key_minimum_256_bits
export OPENAI_API_KEY=your_openai_api_key
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json
export PYTHON_API_URL=http://localhost:8000

# Gradle로 실행
./gradlew bootRun

# 또는 빌드 후 실행
./gradlew build
java -jar build/libs/med-0.0.1-SNAPSHOT.jar
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

**API 문서**:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

### 4. 프론트엔드 실행

```bash
cd medFE

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

Vite 프록시 설정으로 인해 `/api` 요청은 자동으로 백엔드(`localhost:8080`)로 프록시됩니다.

---

## 환경 변수 설정

### 백엔드 환경 변수

전체 키 목록은 [`medBE/.env.example`](./medBE/.env.example)를 기준으로 하세요.

#### 필수 환경 변수

```bash
# Database (로컬 또는 Supabase — DB_URL만 교체)
DB_URL=jdbc:postgresql://localhost:5432/localMED_DB
DB_USERNAME=sxxm
DB_PASSWORD=your_db_password

# JWT 시크릿 키 (최소 256비트 권장)
# 생성 방법: openssl rand -base64 32
JWT_SECRET=your_jwt_secret_key_minimum_256_bits_here

# OpenAI GPT API
OPENAI_API_KEY=sk-your_openai_api_key_here
```

#### 선택적 환경 변수

```bash
GPT_API_URL=https://api.openai.com/v1/chat/completions
GPT_MODEL=gpt-4o-mini
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json
PYTHON_API_URL=http://localhost:8000
MFDS_API_URL=
MFDS_API_KEY=
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
SERVER_PORT=8080
CONTENT_VALIDATION_ENABLED=false
```

#### 환경 변수 설정 방법

**방법 1: 시스템 환경 변수 (로컬 개발)**
```bash
# Linux/macOS
export JWT_SECRET=your_jwt_secret
export OPENAI_API_KEY=your_openai_key
# ... 기타 환경 변수

# Windows (PowerShell)
$env:JWT_SECRET="your_jwt_secret"
$env:OPENAI_API_KEY="your_openai_key"
```

**방법 2: .env 파일 사용**
```bash
cd medBE
cp .env.example .env
# .env에 DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET 등 채우기

set -a && source .env && set +a
./gradlew bootRun
```

**방법 3: Docker Compose**
```yaml
# docker-compose.yml
services:
  med-be:
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      # ... 기타 환경 변수
```

### 프론트엔드 환경 변수

```bash
# .env 파일 생성 (선택적)
VITE_API_BASE_URL=http://localhost:8080
```

기본값은 `http://localhost:8080`이며, Vite 프록시를 사용하는 경우 빈 문자열로 설정할 수 있습니다.

**Vercel 배포 시**:
- Vercel 대시보드 → Settings → Environment Variables
- `VITE_API_BASE_URL` 추가 (예: `https://api.yourdomain.com`)
- 모든 환경(Production, Preview, Development)에 설정
- 환경 변수 변경 후 재배포 필요

### Python 서비스 환경 변수

```bash
# .env 파일 생성
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
GPT_MODEL=gpt-4o-mini
```

---

## 데이터베이스 설정

### 연결 방식

- **엔진**: PostgreSQL (로컬 또는 Supabase)
- **설정**: `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` 환경변수
- **로컬 개발**: 로컬 DB 또는 Supabase 모두 가능 — `DB_URL`만 바꾸면 됩니다
- **상세 가이드**: [`medBE/README.md`](./medBE/README.md) (Supabase Direct connection 절차)

### 주요 테이블

1. **users** - 사용자 정보
   - id, username, password, email, nickname
   - created_at, updated_at

2. **user_allergies** - 사용자 알러지 정보
   - id, user_id, ingredient_name, description, severity
   - allergy_type (MEDICATION/FOOD)
   - food_category (NUTS/DAIRY_EGG/SEAFOOD/GRAINS_GLUTEN/SOY/SEEDS/OTHER)
   - created_at, updated_at

3. **side_effect_reports** - 부작용 보고서
   - id, user_id, description, analysis_result
   - created_at, updated_at

4. **side_effect_medications** - 부작용 약물 목록
   - report_id, medication_name

5. **ocr_ingredients** - OCR 성분 분석 결과
   - id, user_id, image_url, ocr_text, analysis_result
   - created_at, updated_at

6. **ocr_ingredient_list** - OCR 성분 목록
   - ocr_id, ingredient_name

7. **posts** - 게시글
   - id, author_id, title, content, category
   - created_at, updated_at

8. **comments** - 댓글
   - id, post_id, author_id, content
   - created_at

9. **post_likes** - 게시글 좋아요
   - post_id, user_id

10. **comment_likes** - 댓글 좋아요
    - comment_id, user_id

### 스키마 실행

```bash
psql -U postgres -d localMED_DB -f medBE/src/main/resources/db/schema.sql
```

### 인덱스 및 트리거

- 성능 최적화를 위해 주요 컬럼에 인덱스가 생성됩니다
- `updated_at` 컬럼이 자동으로 업데이트되도록 트리거가 설정되어 있습니다
- 외래키 제약조건에 CASCADE 삭제가 설정되어 있어 사용자 삭제 시 관련 데이터가 함께 삭제됩니다

---

## API 문서

### Swagger UI

백엔드 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### 주요 API 엔드포인트

#### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/find-username` - 아이디 찾기
- `POST /api/auth/find-password` - 비밀번호 찾기
- `POST /api/auth/change-password` - 비밀번호 변경
- `POST /api/auth/change-nickname` - 닉네임 변경

#### 사용자 및 알러지
- `GET /api/users/{userId}` - 사용자 정보 조회
- `GET /api/users/{userId}/allergies` - 알러지 목록 조회
- `POST /api/users/{userId}/allergies` - 알러지 추가
- `DELETE /api/users/{userId}/allergies/{allergyId}` - 알러지 삭제

#### 분석
- `POST /api/analysis/symptom` - 증상 분석
- `POST /api/analysis/side-effect` - 부작용 분석
- `POST /api/analysis/ocr` - OCR 성분표 분석

#### 커뮤니티
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/{postId}` - 게시글 상세 조회
- `PUT /api/posts/{postId}` - 게시글 수정
- `DELETE /api/posts/{postId}` - 게시글 삭제
- `POST /api/posts/{postId}/like` - 게시글 좋아요
- `GET /api/posts/{postId}/comments` - 댓글 목록 조회
- `POST /api/posts/{postId}/comments` - 댓글 작성
- `PUT /api/comments/{commentId}` - 댓글 수정
- `DELETE /api/comments/{commentId}` - 댓글 삭제
- `POST /api/comments/{commentId}/like` - 댓글 좋아요

### Python API 엔드포인트

- `POST /analyze/ingredients` - 성분 분석
- `POST /analyze/sideeffects` - 부작용 분석
- `POST /ocr/normalize` - OCR 텍스트 정규화

FastAPI 자동 생성 문서:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 배포 가이드

### 로컬 개발 환경

로컬 개발 시 참고:

- **데이터베이스**: `DB_URL`로 로컬 PostgreSQL 또는 Supabase 지정
- **CORS**: `localhost`, `127.0.0.1`, `*.vercel.app` 등 (`CorsConfig.java`)
- **API 프록시**: Vite 프록시 사용

### 프로덕션 배포

#### 백엔드 배포

**1. Supabase 설정**
   - Supabase 프로젝트 생성 후 Direct connection으로 `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` 등록
   - 스키마(`schema.sql`) 적용
   - 상세: [`medBE/README.md`](./medBE/README.md)

**2. Docker 배포**
   ```bash
   cd medBE
   docker build -t med-backend .
   docker run -p 8080:8080 --env-file .env med-backend
   ```

**3. 클라우드(ECS 등) 배포**
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` 등 동일 환경변수를 플랫폼에 설정
   - Docker 이미지 또는 JAR 파일 배포

#### 프론트엔드 배포 (Vercel)

**1. Vercel 웹 대시보드 사용 (권장)**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 선택 및 Import
   - 프로젝트 설정:
     - Framework Preset: Vite (자동 감지)
     - Root Directory: `./medFE`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - 환경 변수 설정:
     - `VITE_API_BASE_URL`: 백엔드 API URL (예: `https://api.yourdomain.com`)
   - "Deploy" 버튼 클릭

**2. Vercel CLI 사용**
   ```bash
   cd medFE
   npm i -g vercel
   vercel login
   vercel
   vercel --prod
   ```

**3. 환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - `VITE_API_BASE_URL` 추가
   - 모든 환경(Production, Preview, Development)에 설정
   - 환경 변수 변경 후 재배포 필요

#### Python 서비스 배포

**1. Docker 배포**
   ```bash
   cd medPY
   docker build -t med-python .
   docker run -p 8000:8000 --env-file .env med-python
   ```

**2. 클라우드 서비스**
   - AWS ECS, Google Cloud Run 등에 배포
   - 환경 변수 설정 필수

---

## HTTPS 설정

프로덕션 환경에서 HTTPS를 설정하여 Mixed Content 문제를 해결할 수 있습니다.

### 사전 요구사항

- EC2 서버에 접근 권한
- 도메인 (권장) 또는 IP 주소
- 포트 80, 443이 열려 있어야 함 (AWS Security Group 설정)

### 도메인이 있는 경우 (권장)

**1. 도메인 DNS 설정**
   ```
   A 레코드: api.yourdomain.com -> EC2_IP_ADDRESS
   ```

**2. SSL 인증서 발급**
   ```bash
   cd medBE
   ./scripts/setup-ssl.sh api.yourdomain.com your-email@example.com
   ```

**3. Nginx 설정 업데이트**
   - `nginx/nginx.conf` 파일에서 `server_name` 수정

**4. Docker Compose 재시작**
   ```bash
   cd ~/med
   docker-compose down
   docker-compose up -d --build
   ```

**5. 인증서 자동 갱신 설정**
   ```bash
   # Crontab에 자동 갱신 추가
   sudo crontab -e
   # 다음 줄 추가 (매일 자정에 갱신 확인)
   0 0 * * * certbot renew --quiet && cd ~/med && docker-compose restart nginx
   ```

### 도메인이 없는 경우 (임시)

자체 서명 인증서를 사용할 수 있지만, 브라우저에서 보안 경고가 표시됩니다.

```bash
cd medBE
./scripts/setup-ssl.sh
```

⚠️ **주의**: 자체 서명 인증서는 프로덕션 환경에서 사용하지 마세요.

### 프론트엔드 환경 변수 업데이트

Vercel 대시보드에서 환경 변수 설정:
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

프론트엔드 재배포 후 테스트하세요.

### 아키텍처

```
인터넷
  │
  ├─ HTTPS (443) ──> Nginx (리버스 프록시)
  │                      │
  │                      └─> HTTP (8080) ──> Spring Boot
  │
  └─ HTTP (80) ──> Nginx ──> HTTPS로 리다이렉트
```

---

## 문제 해결

### CORS 에러

**증상**: 브라우저 콘솔에 CORS 관련 에러 메시지

**해결책**:
- `CorsConfig.java`에서 로컬 도메인이 올바르게 허용되어 있는지 확인
- 프론트엔드가 `localhost:3000`에서 실행 중인지 확인
- 프로덕션 환경에서는 Vercel 도메인을 CORS 허용 목록에 추가

### 데이터베이스 연결 실패

**증상**: 백엔드 시작 시 데이터베이스 연결 오류

**해결책**:
- `DB_URL` / `DB_USERNAME` / `DB_PASSWORD`가 설정·주입되었는지 확인
- 로컬 사용 시 PostgreSQL 기동 여부 확인 (`./medBE/scripts/setup-local-db.sh`)
- Supabase 사용 시 Direct host·포트(5432)·비밀번호·스키마 적용 여부 확인

### API 프록시가 작동하지 않음

**증상**: 프론트엔드에서 API 요청이 실패

**해결책**:
- Vite 개발 서버가 실행 중인지 확인
- `vite.config.ts`의 프록시 설정 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 환경 변수 `VITE_API_BASE_URL` 확인

### Python 서비스 연결 실패

**증상**: 백엔드에서 Python 서비스 호출 실패

**해결책**:
- Python 서비스가 `localhost:8000`에서 실행 중인지 확인
- 환경 변수 `PYTHON_API_URL` 확인
- Python 서비스 로그 확인
- 네트워크 연결 확인

### JWT 토큰 만료

**증상**: 로그인 후 일정 시간 후 자동 로그아웃

**해결책**:
- JWT 토큰 만료 시간 확인
- 토큰 갱신 로직 구현 (선택적)
- 로그인 상태 유지를 위한 토큰 저장 확인

### Mixed Content 경고

**증상**: HTTPS 페이지에서 HTTP API 호출 시 브라우저 차단

**해결책**:
- 백엔드 서버에 HTTPS 설정 (권장)
- Vercel 프록시 사용 (임시 해결책)
- 프론트엔드 환경 변수를 HTTPS URL로 변경

### 환경 변수가 로드되지 않음

**증상**: 환경 변수 설정 후에도 적용되지 않음

**해결책**:
- 환경 변수 이름 확인 (대소문자 구분)
- `.env` 파일이 올바른 위치에 있는지 확인
- 환경 변수 로드 순서 확인
- 애플리케이션 재시작
- Vercel 배포 시 환경 변수 변경 후 재배포 필요

---

## 라이선스

MIT

---

## 기여하기

이슈나 개선 사항이 있으면 GitHub Issues를 통해 제안해주세요.

## 문의

프로젝트 관련 문의사항이 있으면 이슈를 등록해주세요.
