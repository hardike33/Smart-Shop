# Daily Plate Backend Server

This is a Spring Boot application providing the REST API for the Daily Plate restaurant listing.

## Prerequisites
- Java 17 or higher
- MySQL Server

## How to Run
1. Start your MySQL server.
2. Run the `seed.sql` script to create the database and populate it with initial data.
3. Update `src/main/resources/application.properties` with your MySQL username and password if different.
4. Run the application using your IDE (e.g., VS Code with Spring Boot Extension Pack or IntelliJ) or via Maven.

## API Endpoints
- `GET /api/restaurants`: Returns a list of all restaurants.
- `POST /api/restaurants`: Add a new restaurant.
