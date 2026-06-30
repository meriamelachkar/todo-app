FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY todo-backend/ ./todo-backend/

WORKDIR /app/todo-backend

RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

EXPOSE 8081

CMD ["java", "-jar", "build/libs/todo-backend-0.0.1-SNAPSHOT.jar"]