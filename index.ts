import Koa from "koa";
import { router } from "./src/router";
import cors from "@koa/cors";
import contextMiddleware from "./src/middleware/context";
import errorMiddleware from "./src/middleware/error";
import userMiddleware from "./src/middleware/user";
import bodyParser from "koa-bodyparser";

const app:Koa = new Koa();

app.keys = ["nosanasecret"];
app.proxy = true;

app
  .use(cors())
  .use(bodyParser())
  .use(contextMiddleware())
  .use(errorMiddleware())
  .use(userMiddleware())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4124, () => console.log("running on port 4124"));
