# ============================================
# Multi-stage build — Spring Boot 3.3.5 / Java 17 (Render Docker Web Service)
# Render는 PORT 환경변수로 리슨 포트를 주입합니다 (server.port=${PORT:8080})
# ============================================

# Stage 1: 빌드 (프로젝트 Gradle Wrapper 9.2.1 사용)
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle
RUN chmod +x ./gradlew

# 의존성 캐시 레이어
RUN ./gradlew dependencies --no-daemon || true

COPY src ./src

# bootJar만 생성 (plain jar 제외). 고정 파일명으로 복사해 COPY 다중 매칭 오류 방지
RUN ./gradlew clean bootJar -x test --no-daemon \
  && cp build/libs/*.jar /app/application.jar

# Stage 2: 실행 (JRE slim)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=build /app/application.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${PORT:-8080}/actuator/health" || exit 1

# PORT / JAVA_OPTS는 셸에서 확장
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
