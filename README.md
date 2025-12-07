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
       ├──► PostgreSQL (로컬 또는 AWS RDS)
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
- **PostgreSQL** (로컬 또는 AWS RDS)
- **현재 연결**: 로컬 PostgreSQL (`localhost:5432/localMED_DB`)

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
│   │       ├── schema.sql    # 데이터베이스 스키마
│   │       └── README.md
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

#### 로컬 PostgreSQL 사용

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE localMED_DB;

# 사용자 생성 (선택적)
CREATE USER sxxm WITH PASSWORD 'sxxmpass';
GRANT ALL PRIVILEGES ON DATABASE localMED_DB TO sxxm;

# 스키마 실행
\c localMED_DB
\i medBE/src/main/resources/db/schema.sql
```

#### AWS RDS 사용

`medBE/src/main/resources/application.properties`에서 RDS 설정 주석을 해제하고 로컬 설정을 주석 처리하세요.

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

### 3. 백엔드 실행

```bash
cd medBE

# 환경 변수 설정
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

#### 필수 환경 변수

```bash
# JWT 시크릿 키 (최소 256비트 권장)
JWT_SECRET=your_jwt_secret_key_minimum_256_bits_here

# OpenAI GPT API
OPENAI_API_KEY=sk-your_openai_api_key_here
GPT_API_URL=https://api.openai.com/v1/chat/completions
GPT_MODEL=gpt-4o-mini

# Google Vision API
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json

# Python API 서비스
PYTHON_API_URL=http://localhost:8000
```

#### 선택적 환경 변수

```bash
# 데이터베이스 (로컬 사용 시 application.properties에서 직접 설정)
med_DB_USERNAME=sxxm
med_DB_PASSWORD=sxxmpass

# 이메일 설정 (Gmail SMTP)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# 서버 포트 (기본값: 8080)
SERVER_PORT=8080

# 콘텐츠 검증 (기본값: false)
CONTENT_VALIDATION_ENABLED=false
```

### 프론트엔드 환경 변수

```bash
# .env 파일 생성 (선택적)
VITE_API_BASE_URL=http://localhost:8080
```

기본값은 `http://localhost:8080`이며, Vite 프록시를 사용하는 경우 빈 문자열로 설정할 수 있습니다.

### Python 서비스 환경 변수

```bash
# .env 파일 생성
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
GPT_MODEL=gpt-4o-mini
```

---

## 데이터베이스 설정

### 현재 연결 정보

- **데이터베이스**: PostgreSQL
- **호스트**: localhost:5432
- **데이터베이스명**: `localMED_DB`
- **사용자명**: `sxxm`
- **비밀번호**: `sxxmpass`

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

4. **ocr_ingredients** - OCR 성분 분석 결과
   - id, user_id, image_url, ocr_text, analysis_result
   - created_at, updated_at

5. **posts** - 게시글
   - id, author_id, title, content, category
   - created_at, updated_at

6. **comments** - 댓글
   - id, post_id, author_id, content
   - created_at

### 스키마 실행

```bash
psql -U postgres -d localMED_DB -f medBE/src/main/resources/db/schema.sql
```

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

현재 프로젝트는 로컬 개발 환경으로 설정되어 있습니다:

- **데이터베이스**: 로컬 PostgreSQL (`localhost:5432/localMED_DB`)
- **CORS**: 로컬 도메인만 허용 (`localhost`, `127.0.0.1`)
- **API 프록시**: Vite 프록시 사용

### 프로덕션 배포

#### 백엔드 배포

1. **AWS RDS 설정**
   - `application.properties`에서 RDS 설정 주석 해제
   - 환경 변수 설정: `med_DB_USERNAME`, `med_DB_PASSWORD`

2. **Docker 배포**
   ```bash
   cd medBE
   docker build -t med-backend .
   docker run -p 8080:8080 --env-file .env med-backend
   ```

3. **AWS Elastic Beanstalk / ECS**
   - 환경 변수를 플랫폼에 설정
   - Docker 이미지 또는 JAR 파일 배포

#### 프론트엔드 배포

1. **Vercel 배포**
   ```bash
   cd medFE
   npm run build
   vercel deploy
   ```

2. **환경 변수 설정**
   - Vercel 대시보드에서 환경 변수 설정
   - `VITE_API_BASE_URL` 설정

#### Python 서비스 배포

1. **Docker 배포**
   ```bash
   cd medPY
   docker build -t med-python .
   docker run -p 8000:8000 --env-file .env med-python
   ```

2. **클라우드 서비스**
   - AWS ECS, Google Cloud Run 등에 배포
   - 환경 변수 설정 필수

---

## 문제 해결

### CORS 에러

- `CorsConfig.java`에서 로컬 도메인이 올바르게 허용되어 있는지 확인
- 프론트엔드가 `localhost:3000`에서 실행 중인지 확인

### 데이터베이스 연결 실패

- PostgreSQL이 실행 중인지 확인
- `application.properties`의 데이터베이스 URL 확인
- 환경 변수 `med_DB_USERNAME`, `med_DB_PASSWORD` 확인

### API 프록시가 작동하지 않음

- Vite 개발 서버가 실행 중인지 확인
- `vite.config.ts`의 프록시 설정 확인
- 브라우저 콘솔에서 에러 메시지 확인

### Python 서비스 연결 실패

- Python 서비스가 `localhost:8000`에서 실행 중인지 확인
- 환경 변수 `PYTHON_API_URL` 확인
- Python 서비스 로그 확인

---

## 라이선스

MIT

---

## 추가 문서

- [로컬 개발 환경 설정 가이드](LOCAL_DEV_SETUP.md)
- [환경 변수 설정 가이드](medBE/ENV_VARIABLES.md)
- [데이터베이스 스키마 가이드](medBE/src/main/resources/db/README.md)
- [프론트엔드 개발기](medFE/TECH_BLOG.md)

