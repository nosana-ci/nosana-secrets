# build container
FROM node:18.12.1 as build-base

# install all application dependencies
WORKDIR /build
COPY package*.json .
RUN npm ci

# pull ca certs for aws docdb
RUN curl -O https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem

# build application remove dev dependencies
COPY . .
RUN npm run build \
 && npm ci --omit=dev

# prepare application for copy
RUN mkdir app \
 && mv node_modules rds-combined-ca-bundle.pem dist/* app \
 && mv config/keys/*.key app/config/keys

# main container
FROM alpine:3.17.0

# environment
ENV NODE_ENV=production \
    APP_ENV=production

# packages
RUN apk add --update --no-cache nodejs openssl

# copy application
WORKDIR /app
COPY --from=build-base /build/app .

# ca certificates for aws docdb
RUN openssl x509 -in rds-combined-ca-bundle.pem -inform PEM -out rds-combined-ca-bundle.crt && update-ca-certificates

# entrypoint
EXPOSE 4124
ENTRYPOINT ["node", "index.js"]
