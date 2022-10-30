const {
    ForbiddenError
} = require('../generic/errors');

module.exports = async (ctx, next) => {
    if (!ctx.state.user || !ctx.state.user.roles || !ctx.state.user.roles.includes('admin')) {
        throw new ForbiddenError('No admin');
    }
    await next();
};
