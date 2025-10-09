#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NONE='\033[0m'

MODE=$1

DOCKER_REPO="phamphong07/fittogether"

source .env

echo -e "[${GREEN}START${NONE}] Building..... ${MODE}  ${NONE}"
echo -e "[${GREEN}DOCKER_USERNAME${NONE}] $DOCKER_USERNAME"
echo -e "[${GREEN}DOCKER_PASSWORD${NONE}] $DOCKER_PASSWORD"
echo -e "[${GREEN}DOCKER_REPO${NONE}] $DOCKER_REPO"
echo -e "[${GREEN}MODE${NONE}] $MODE"

echo "Logging in to Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

if [ $? -ne 0 ]; then
    echo -e "[${RED}ERROR${NONE}] Docker Hub login failed"
    exit 1
fi

if [ "$MODE" = 'prod' ]; then
    echo -e "[${GREEN}Building production image...${NONE}]"
    docker build -t "$DOCKER_REPO:prod" . -f Dockerfile.prod
    docker push "$DOCKER_REPO:prod"
elif [ "$MODE" = 'staging' ]; then
    echo -e "[${GREEN}Building staging image...${NONE}]"
    docker build -t "$DOCKER_REPO:staging" . -f Dockerfile.stg
    docker push "$DOCKER_REPO:staging"
else
    echo -e "[${RED}ERROR${NONE}] Unknown mode: $MODE. Please specify 'prod' or 'staging'."
    exit 1
fi

echo -e "[${GREEN}DONE${NONE}] ${MODE} build and push successfully!"