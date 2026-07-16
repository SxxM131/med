# medBE — Spring Boot 백엔드

## 데이터베이스 설정 (환경변수)

DB 접속 정보는 properties에 하드코딩하지 않습니다.
`DB_URL` / `DB_USERNAME` / `DB_PASSWORD`만 바꾸면 **로컬 PostgreSQL**과 **Supabase**(관리형 PostgreSQL)를 모두 사용할 수 있습니다.

```bash
cp .env.example .env
# .env 값을 채운 뒤
set -a && source .env && set +a
./gradlew bootRun
```

전체 환경변수 목록은 [`.env.example`](./.env.example)를 참고하세요.

---

## Supabase 사용 절차

### 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com)에서 계정 생성/로그인
2. **New project**로 프로젝트 생성
3. 지역·DB 비밀번호를 설정하고 프로젝트가 Ready 될 때까지 대기

### 2. Direct connection 문자열 확인

1. 프로젝트 대시보드 → **Project Settings** → **Database**
2. **Connection string** / **Connection parameters**에서 Direct connection 정보를 확인합니다.
3. Spring Boot는 JDBC를 사용하므로 URI를 아래처럼 변환합니다.

| Supabase (URI 예시) | JDBC (`DB_URL`) |
|---------------------|-----------------|
| `postgresql://postgres:PASSWORD@db.<ref>.supabase.co:5432/postgres` | `jdbc:postgresql://db.<ref>.supabase.co:5432/postgres` |

연결 파라미터:

- **Host**: `db.<project-ref>.supabase.co`
- **Port**: `5432` (Direct)
- **Database**: `postgres`
- **User**: 보통 `postgres` (또는 대시보드에 표시된 사용자)
- **Password**: 프로젝트 생성 시 설정한 DB 비밀번호

> Session/Transaction pooler(예: 6543)를 쓰는 경우 Host·Port·User 형식이 다를 수 있습니다. JPA 장시간 연결에는 Direct(5432)를 권장합니다.

### 3. 환경변수 등록

`.env` 또는 배포 플랫폼에 다음을 설정합니다.

```bash
DB_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=
JWT_SECRET=
# ... 기타 .env.example 참고
```

Docker Compose / 클라우드 배포 시에도 **동일한 이름**(`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`)을 주입하세요.

### 4. 스키마 적용

Supabase SQL Editor 또는 `psql`로 스키마를 적용합니다.

```bash
psql "$DB_URL_WITHOUT_JDBC_PREFIX" -f src/main/resources/db/schema.sql
```

또는 대시보드 **SQL Editor**에 `src/main/resources/db/schema.sql` 내용을 실행합니다.

`application-prod.properties`는 `ddl-auto=validate`이므로, prod에서는 스키마를 **미리** 맞춰 두어야 합니다.

---

## 로컬 PostgreSQL 사용

로컬 DB로 개발할 수도 있습니다. `scripts/setup-local-db.sh`로 DB/유저를 만든 뒤:

```bash
DB_URL=jdbc:postgresql://localhost:5432/localMED_DB
DB_USERNAME=sxxm
DB_PASSWORD=
```

로컬 ↔ Supabase 전환은 **properties 수정 없이 `DB_URL` 등만 교체**하면 됩니다.

---

## Render 배포 (Docker Web Service)

[Render](https://render.com)는 컨테이너에 **`PORT` 환경변수**로 리슨 포트를 주입합니다.  
`application-prod.properties`는 `server.port=${PORT:8080}`을 사용하며, 헬스체크는 `/actuator/health`입니다.

### 사전 준비

1. Supabase에 `schema.sql` 적용 완료 (`ddl-auto=validate`)
2. GitHub 저장소에 `medBE/Dockerfile`, 루트 `render.yaml` 커밋
3. Render 계정 생성 및 GitHub 연동

### 배포 순서

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. 이 저장소를 연결하면 루트 `render.yaml`이 감지됩니다.
3. **Environment** 탭에서 아래 변수를 **수동 입력** (`sync: false` 항목):
   - 필수: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`
   - GPT 사용 시: `OPENAI_API_KEY`
   - 선택: `GPT_API_URL`, `GPT_MODEL`, `PYTHON_API_URL`, `MFDS_*`, `MAIL_*`, `GOOGLE_APPLICATION_CREDENTIALS`, `CONTENT_VALIDATION_ENABLED`
4. **Deploy** — Docker 빌드 후 Web Service가 기동됩니다.
5. 배포 URL 확인 (예: `https://med-backend.onrender.com`)
6. 헬스체크: `GET https://<your-service>.onrender.com/actuator/health`
7. Vercel 프론트 `VITE_API_BASE_URL`을 Render 백엔드 URL로 설정

### CORS

프론트(Vercel) origin만 `CorsConfig`에 허용하면 됩니다.  
Render 백엔드 URL은 API **target**이지 브라우저 **origin**이 아니므로 CORS 허용 목록에 넣을 필요가 없습니다.

### 로컬 Docker 이미지 테스트 (선택)

```bash
cd medBE
docker build -t med-backend .
docker run --rm -p 8080:8080 --env-file .env -e PORT=8080 med-backend
```

---

## 컴파일

```bash
./gradlew compileJava
```
