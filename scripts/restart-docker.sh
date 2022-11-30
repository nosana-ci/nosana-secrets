#!/usr/bin/env bash

function print() {
  echo ""; echo $1; echo ""
}

print "(Re)starting..."
docker-compose down
print "Installing dependencies..."
docker-compose run --rm nosana-secret-manager npm ci
docker-compose up -d
print "Done!"
