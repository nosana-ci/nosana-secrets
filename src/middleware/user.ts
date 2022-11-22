import jwt from "jsonwebtoken";
import { Context } from "koa";

import config from "../generic/config";

const { publicCert } = config.keys;

import { ForbiddenError } from "../generic/errors";

export default () =>
  async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    let token = ctx.headers.authorization;
    if (token) {
      if (token.startsWith("Bearer")) {
        token = token.split(" ")[1];
      }

      try {
        ctx.state.user = await jwt.verify(token, publicCert, {
          algorithms: ["RS256"],
        });
      } catch (err) {
        throw new ForbiddenError(err.message, err.name);
      }
    }

    await next();
  };
