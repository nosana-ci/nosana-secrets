import jwt from 'jsonwebtoken';
import { Context } from 'koa';

import config from '../generic/config';

import { ForbiddenError } from '../generic/errors';

export default () =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    let token = ctx.headers.authorization;
    if (token) {
      if (token.startsWith('Bearer')) {
        token = token.split(' ')[1];
      }

      try {
        ctx.state.user = await jwt.verify(token, config.auth.jwtSecret);
      } catch (err) {
        throw new ForbiddenError(err.message, err.name);
      }
    }

    await next();
  };
