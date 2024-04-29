# Dockerize-MongoDB-NestJs

This repository contains a Docker Compose setup for running MongoDB, Mongo Express, and a Nest.js CRUD application, providing a convenient way to manage MongoDB databases and interact with them using a web-based administrative interface.

## MongoDB Service

- **Image**: The MongoDB service uses the official MongoDB image from Docker Hub.
- **Container Name**: The container running MongoDB is named `mongodb`.
- **Ports**: MongoDB is accessible on port `27017` of the host machine.
- **Volumes**: Data stored in MongoDB is persisted using a Docker volume named `mongodb_data`, which is mounted to the `/data/db` directory inside the MongoDB container.

## Mongo Express Service

- **Image**: The Mongo Express service uses the `mongo-express` image, which is a web-based administrative interface for MongoDB.
- **Container Name**: The container running Mongo Express is named `mongo-express`.
- **Ports**: Mongo Express is accessible on port `8081` of the host machine.
- **Environment Variables**: Mongo Express is configured to connect to the MongoDB service (`mongodb`) using environment variables. Basic authentication is enabled with the username `admin` and password `password`.
- **Depends On**: Mongo Express depends on the MongoDB service (`mongodb`), ensuring that MongoDB is started before Mongo Express.

## Nest.js CRUD Application

- **Dockerfile**: The Nest.js application is containerized using a Dockerfile located in the `nest-mongodb` directory.
- **Container Name**: The container running the Nest.js application is named `nest-mongodb`.
- **Ports**: The Nest.js application is accessible on port `3000` of the host machine.
- **Volumes**: The Nest.js application code is mounted from the `./nest-mongodb` directory to the `/app` directory inside the container.
- **Depends On**: The Nest.js application depends on the MongoDB service (`mongodb`).

### CRUD Functionality

The Nest.js application provides the following CRUD endpoints for managing data:

- **POST /items**: Create a new item.
- **GET /items**: Retrieve all items.
- **GET /items/:id**: Retrieve a specific item by ID.
- **PATCH /items/:id**: Update a specific item by ID.
- **DELETE /items/:id**: Delete a specific item by ID.

These endpoints allow you to perform basic CRUD operations on the MongoDB database using the Nest.js application.

## MongoDB, Mongo Express, and Nest.js

- **Port Usage**: MongoDB uses port `27017`, which is the default port for MongoDB connections. Mongo Express uses port `8081` to provide a web-based interface for managing MongoDB databases. The Nest.js application uses port `3000`.
- **Purpose**: MongoDB is a NoSQL database that stores data in a flexible, JSON-like format. It is widely used for various types of applications, including web and mobile applications. Mongo Express is a lightweight administrative interface for MongoDB, allowing users to perform CRUD operations, view database statistics, and manage database users through a web browser. Nest.js is a framework for building efficient, scalable Node.js server-side applications with TypeScript.

## Accessing MongoDB, Mongo Express, and Nest.js

- After starting the Docker containers using `docker-compose up`, MongoDB can be accessed using any MongoDB client that supports connection to `localhost:27017`. Mongo Express can be accessed by navigating to `http://localhost:8081` in a web browser. Use the username `admin` and password `password` to log in to Mongo Express. The Nest.js application endpoints can be accessed at `http://localhost:3000/items`.

## Makefile

This repository includes a Makefile with the following targets:

- **up**: Starts the Docker containers.
- **down**: Stops the Docker containers.
- **restart**: Restarts the Docker containers.
- **logs**: Fetches logs from the Docker containers.

## Note

- Ensure that no other application is already using ports `27017`, `8081`, and `3000` on your host machine to avoid conflicts when running the containers.
