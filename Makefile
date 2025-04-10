all:
	docker-compose down
	docker-compose up --build

down:
		@docker compose -f ./docker-compose.yml down

clean: down
		@docker system prune -a -f

# Levantar solo el contenedor de frontend
tw: down
	@docker system prune -a -f
	@docker-compose -f docker-compose.yml up frontend

re: clean
	docker-compose down
	docker-compose up --build

.PHONY: clean down tw

