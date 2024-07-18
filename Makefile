# Variables
DOCKER_COMPOSE = docker-compose
DOCKER = docker

# Targets
.PHONY: all up down restart logs clean

all: up

up:
	@echo "Starting containers..."
	$(DOCKER_COMPOSE) up --build -d

down:
	@echo "Stopping containers..."
	$(DOCKER_COMPOSE) down

restart: down up

logs:
	@echo "Fetching container logs..."
	$(DOCKER_COMPOSE) logs -f

clean: down
	@echo "Cleaning volumes, images, and containers..."
	-$(DOCKER_COMPOSE) down -v --remove-orphans
	-$(DOCKER) system prune -af
	-$(DOCKER) volume prune -f
