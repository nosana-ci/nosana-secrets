import { Context } from "koa";

const reply =
  (ctx: Context) =>
  (statusCode: number, body: any): void => {
    if (body) {
      body = JSON.stringify(body);
    }

    ctx.response.body = body;
    ctx.response.status = statusCode;
  };

const ok = (ctx: Context) => (body: any) => {
  ctx.reply(200, body);
};

export default () =>
  async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    ctx.reply = reply(ctx);
    ctx.ok = ok(ctx);
    await next();
  };
