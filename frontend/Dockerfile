# Use a more recent stable Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]
