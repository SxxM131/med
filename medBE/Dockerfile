# ============================================
# Multi-stage build — Spring Boot 3.3.5 / Java 17 (Render Docker Web Service)
# Render는 PORT 환경변수로 리슨 포트를 주입합니다 (server.port=${PORT:8080})
# ============================================

# Stage 1: 빌드
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle

RUN gradle dependencies --no-daemon || true

COPY src ./src

RUN gradle clean build -x test --no-daemon

# Stage 2: 실행 (JRE slim)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=build /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${PORT}/actuator/health" || exit 1

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", \
  "app.jar"]
