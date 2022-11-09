require('dotenv').config();
const Koa = require('koa');
const router = require('./src/router');
const corsMiddelware = require('@koa/cors');
const contextMiddleware = require('./src/middleware/context');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./src/middleware/error');
const userMiddleware = require('./src/middleware/user');

const app = new Koa();

app.keys = ['nosanasecret'];
app.proxy = true;

app.use(corsMiddelware())
    .use(bodyParser())
    .use(contextMiddleware())
    .use(errorMiddleware())
    .use(userMiddleware)
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4124, () => console.log('running on port 4124'));

