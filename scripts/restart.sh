#!/usr/bin/env bash

function print() {
  echo ""; echo $1; echo ""
}

print "(Re)starting..."
print "Installing dependencies..."
npm ci
print "Starting server..."
npm run dev
