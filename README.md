# Dockerize-MongoDB-NestJs
Docker MongoDb with NestJs

This repository contains a Docker Compose setup for running MongoDB , Mongo Express containers and NestJs App, providing a convenient way to manage MongoDB databases and interact with them using a web-based administrative interface.

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
- **Depends On**: Mongo Express depends on the MongoDB service (`mongodb`), ensuring that MongoDB is started before Mongo Express.n 

## MongoDB and Mongo Express

- **Port Usage**: MongoDB uses port `27017`, which is the default port for MongoDB connections. Mongo Express uses port `8081` to provide a web-based interface for managing MongoDB databases.
- **Purpose**: MongoDB is a NoSQL database that stores data in a flexible, JSON-like format. It is widely used for various types of applications, including web and mobile applications. Mongo Express is a lightweight administrative interface for MongoDB, allowing users to perform CRUD operations, view database statistics, and manage database users through a web browser.

## Accessing MongoDB and Mongo Express

- After starting the Docker containers using `docker-compose up`, MongoDB can be accessed using any MongoDB client that supports connection to `localhost:27017`. Mongo Express can be accessed by navigating to `http://localhost:8081` in a web browser. Use the username `admin` and password `password` to log in to Mongo Express.

## Note
- Ensure that no other application is already using ports `27017` and `8081` on your host machine to avoid conflicts when running the containers.

