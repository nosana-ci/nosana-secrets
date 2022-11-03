#!/usr/bin/env bash

function print() {
  echo ""; echo $1; echo ""
}

print "(Re)starting..."
if docker-compose down && docker-compose up -d; then
  print "Installing dependencies..."
  docker-compose run --rm nosana-secret-manager npm ci
  print "Done!"
fi
