# Variables
DOCKER_COMPOSE = docker-compose

# Targets
.PHONY: all up down restart logs

all: up

up:
	@echo "Starting containers..."
	$(DOCKER_COMPOSE) up 

down:
	@echo "Stopping containers..."
	$(DOCKER_COMPOSE) down

restart: down up

logs:
	@echo "Fetching container logs..."
	$(DOCKER_COMPOSE) logs -f
