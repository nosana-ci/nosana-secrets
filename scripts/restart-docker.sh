#!/usr/bin/env bash

function print() {
  echo ""; echo $1; echo ""
}

print "(Re)starting..."
if docker-compose down && docker-compose up -d postgres; then
  print "Installing dependencies..."
  docker-compose run --rm nosana-backend npm ci
  # print "Waiting for MySQL..."
  # ping=1
  # while [ $ping -eq 1 ]; do
  #   pingresult=`docker exec -it $(docker-compose ps -q mysql) bash -c "MYSQL_PWD=root mysqladmin ping --user=root -h localhost"`
  #   if [[ $pingresult == "mysqld is alive"* ]];then
  #     echo "MySQL is ready"
  #     ping=0
  #   fi
  # done
  print "Starting all containers..."
  docker-compose up -d
  print "Running migrations..."
  docker-compose run --rm nosana-backend npm run db:migrate
  print "Running seeds..."
  docker-compose run --rm nosana-backend npm run db:seed
  print "Done!"
fi
