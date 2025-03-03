all:
	docker-compose down
	docker-compose up --build

clean:
	# Detener todos los contenedores en ejecución si existen
	@docker ps -q | grep -q . && docker stop $(docker ps -q) || echo "No containers to stop"

	# Eliminar todos los contenedores detenidos si existen
	@docker ps -a -q | grep -q . && docker rm $(docker ps -a -q) || echo "No containers to remove"

	# Eliminar todas las imágenes si existen
	@docker images -a -q | grep -q . && docker rmi $(docker images -a -q) || echo "No images to remove"

	# Eliminar todos los volúmenes si existen
	@docker volume ls -q | grep -q . && docker volume rm $(docker volume ls -q) || echo "No volumes to remove"

.PHONY: clean

