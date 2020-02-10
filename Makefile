VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
ENV := env.json

MONGO_URI := $$(cat $(ENV) | grep MONGO_URI | sed 's/"/ /g' | awk {'print $$3'})

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
	@echo "[Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy userApi --set-env-vars MONGO_URI=$(MONGO_URI) --runtime nodejs8 --trigger-http --entry-point userApi

run r:
	@echo "[Running] Running service"
	@PORT=$(PORT) MONGO_URI="$(MONGO_URI)" node src/start.js

.PHONY: version v prepare pre run r stop s