all:
	docker-compose down
	docker-compose up --build

down:
		@docker compose -f ./docker-compose.yml down

clean: down
		@docker system prune -a -f

.PHONY: clean down

