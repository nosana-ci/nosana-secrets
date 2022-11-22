FROM node as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine

ENV NODE_ENV=production \
    APP_ENV=production

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm ci --production

COPY config/keys ./config/keys

COPY --from=builder /app/dist ./

EXPOSE 4124
ENTRYPOINT ["npm", "run", "start"]