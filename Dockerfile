FROM node:16-alpine

ENV NODE_ENV=production \
    APP_ENV=production

COPY . /app
WORKDIR /app
RUN npm ci

EXPOSE 4123
ENTRYPOINT ["npm", "run", "start"]
