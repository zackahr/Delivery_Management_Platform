# Dockerfile for nest-mongodb
FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

