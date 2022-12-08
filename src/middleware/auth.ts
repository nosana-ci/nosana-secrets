import { Context } from 'koa';

import { ForbiddenError } from '../generic/errors';

export default async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  if (!ctx.state.user) {
    throw new ForbiddenError('Not authenticated');
  }

  await next();
};
