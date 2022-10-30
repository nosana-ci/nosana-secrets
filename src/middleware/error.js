const util = require('util');

const {
    GenericError,
    BadRequestError,
    ValidationError,
    ForbiddenError,
    NotFoundError,
    TooManyRequestsError,
} = require('../generic/errors');

const formatError = err => {
    if (typeof err === 'string') {
        return {type: err};
    }

    const body = err instanceof GenericError ? err.body : {error: err.message};
    if(err.path && typeof err.message === 'string') {
        body.error = {};
        body.error[err.path] = err.message;
    }


    return {
        type: err.constructor.name,
        ...body
    };
};

module.exports = () => async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        switch (err.constructor) {
            case BadRequestError:
            case ValidationError:
                return ctx.reply(400, formatError(err));
            case ForbiddenError:
                return ctx.reply(403, formatError(err));
            case NotFoundError:
                return ctx.reply(404, formatError(err));
            case TooManyRequestsError:
                return ctx.reply(429, formatError(err));
            default:
                console.error('Internal Server Error', util.inspect(err, {depth: 3}));

                return ctx.reply(500, formatError('InternalServerError'));
        }
    }
};
