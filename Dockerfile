FROM node:16-alpine

ENV NODE_ENV=production \
    APP_ENV=production

COPY . /app
WORKDIR /app
RUN npm ci

EXPOSE 4124
ENTRYPOINT ["npm", "run", "start"]
