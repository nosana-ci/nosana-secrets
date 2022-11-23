import { Context } from "koa";

import { ForbiddenError } from "../generic/errors";

export default async (ctx: Context, next: () => Promise<any>): Promise<any> => {
  if (!ctx.state.user) {
    throw new ForbiddenError("Not authenticated");
  }

  await next();
};
