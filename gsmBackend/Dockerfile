# 1. Build aşaması: Maven ile jar dosyasını üret
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY . /app

RUN mvn clean package -DskipTests

# 2. Run aşaması: Sadece jar dosyasını çalıştır
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/gsmBackend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"] 