# Use Eclipse Temurin as the base image (recommended for Java applications)
FROM eclipse-temurin:17-jdk-focal

# Set working directory
WORKDIR /app

# Copy the Maven POM file
COPY ./Ehr_Backend/Ehr_Backend/pom.xml ./pom.xml

# Copy the source code
COPY ./Ehr_Backend/Ehr_Backend/src ./src

# Copy the Maven wrapper files (if you have them)
COPY ./Ehr_Backend/Ehr_Backend/mvnw ./mvnw
COPY ./Ehr_Backend/Ehr_Backend/.mvn ./.mvn

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port your application runs on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/*.jar"]