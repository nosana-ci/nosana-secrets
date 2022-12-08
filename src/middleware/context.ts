import { Context } from 'koa';

const reply =
  (ctx: Context) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (statusCode: number, body: any): void => {
    if (body) {
      body = JSON.stringify(body);
    }

    ctx.response.body = body;
    ctx.response.status = statusCode;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ok = (ctx: Context) => (body: any) => {
  ctx.reply(200, body);
};

export default () =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    ctx.reply = reply(ctx);
    ctx.ok = ok(ctx);
    await next();
  };
