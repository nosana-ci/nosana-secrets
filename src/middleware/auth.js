const {
    ForbiddenError
} = require('../generic/errors');

module.exports = async (ctx, next) => {
    if (!ctx.state.user) {
        throw new ForbiddenError('Not authenticated');
    }

    await next();
};
