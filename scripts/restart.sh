#!/usr/bin/env bash

function print() {
  echo ""; echo $1; echo ""
}

print "(Re)starting..."
print "Installing dependencies..."
npm ci
print "Running migrations..."
npm run db:migrate
print "Running seeds..."
npm run db:seed
print "Starting server..."
npm run dev
