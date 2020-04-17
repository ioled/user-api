VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
ENV := env.json

PROJECT_ID := $$(cat $(ENV) | grep PROJECT_ID | sed 's/"/ /g' | awk {'print $$3'})

SVC=ioled-user-api
PORT=5030

version v:
	@echo $(VERSION)

init i:
	@echo "[prepare] preparing..."
	@npm install

docker:
	@echo [Docker] Building docker image
	@docker build -t $(SVC):$(VERSION) .

docker-compose co:
	@echo [Docker][Compose] Running with docker compose
	@docker-compose build
	@docker-compose up

deploy d:
	@echo "[PROD][Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy userApi --set-env-vars PROJECT_ID=$(PROJECT_ID) --runtime nodejs8 --trigger-http --entry-point userApi

deploy-dev dev:
	@echo "[DEV][Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy dev-userApi --set-env-vars PROJECT_ID=$(PROJECT_ID) --runtime nodejs8 --trigger-http --entry-point userApi

run r:
	@echo "[Running] Running service"
	@PORT=$(PORT) GOOGLE_APPLICATION_CREDENTIALS="./google-cloud-service-account.json" PROJECT_ID="$(PROJECT_ID)" node src/start.js

.PHONY: version v prepare pre run r stop s