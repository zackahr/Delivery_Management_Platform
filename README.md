
# Delivery Management Platform

This repository contains a comprehensive solution for delivery personnel to manage product commands efficiently. The platform enables users to create commands for the products they sell, including pricing, quantities, and delivery times. It also provides options for modifying or deleting commands and tracks payments to ensure no client runs away without paying.

## Features

- **Command Management**: 
  - Create commands with product prices and quantities.
  - Calculate and display the total price for clients.
  - Set delivery times for each command.

- **Client Management**:
  - Add clients with an option to select their exact location.
  - List of clients includes the ability to view client locations for better delivery tracking.

- **User Customization**:
  - Users can change their usernames and passwords for security.

- **Daily Summary**:
  - Generate daily summaries of all commands and payments.

- **Tracking**:
  - Monitor each client's commands to keep track of payments and outstanding balances.

- **Authentication**:
  - Implemented JSON Web Tokens (JWT) for secure authentication and authorization of users.

## Technology Stack

- **Frontend**: React.js for building a responsive user interface.
- **Backend**: Nest.js for building efficient and scalable server-side applications.
- **Database**: MongoDB for flexible data storage and management.
- **Web Server**: Nginx for serving the application over HTTPS.
- **Hosting**: Digital Ocean for hosting the website.
- **Containerization**: Docker with Docker Compose to manage application containers.

## Docker Compose Setup

The project includes a Docker Compose setup for managing containers for the application. Ensure you have Docker and Docker Compose installed to run the project locally.

## Accessing the Application

After starting the Docker containers, the application can be accessed through a web browser. Please follow these steps to run the application:

1. Clone the repository.
2. Navigate to the project directory.
3. Run `docker-compose up` to start the application.

## Note

- Ensure that no other applications are using the same ports specified in the `docker-compose.yml` file to avoid conflicts.
- Modify environment variables in the `docker-compose.yml` file as necessary for your configuration.

## Makefile

This repository includes a Makefile with the following targets:

- **up**: Starts the Docker containers.
- **down**: Stops the Docker containers.
- **restart**: Restarts the Docker containers.
- **logs**: Fetches logs from the Docker containers.
