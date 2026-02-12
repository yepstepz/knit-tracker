.PHONY: up up-seed down destroy logs

up:
	docker compose up -d --build

up-seed:
	RUN_SEED=1 docker compose up -d --build

down:
	docker compose down

destroy:
	docker compose down -v

logs:
	docker compose logs -f app
