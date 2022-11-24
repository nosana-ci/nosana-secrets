FROM node:16 as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16

ENV NODE_ENV=production \
    APP_ENV=production

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm ci --production

COPY config/keys ./config/keys

COPY --from=builder /app/dist ./

# Download and prepare CA-certificate for AWS DocumentDB
RUN curl -O https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem && \
    openssl x509 -in rds-combined-ca-bundle.pem -inform PEM -out rds-combined-ca-bundle.crt

# Install CA-certificate for AWS DocumentDB
RUN update-ca-certificates

EXPOSE 4124
ENTRYPOINT ["npm", "run", "start"]