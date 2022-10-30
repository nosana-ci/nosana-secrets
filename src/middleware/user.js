const jwt = require('jsonwebtoken');
const config = require('../generic/config');

const { publicCert } = config.keys;

const {
    ForbiddenError
} = require('../generic/errors');

module.exports = async (ctx, next) => {
    let token = ctx.headers.authorization;
    if (token) {
        if(token.startsWith('Bearer')) {
            token = token.split(' ')[1];
        }

        try {
            ctx.state.user =
                await jwt.verify(
                    token,
                    publicCert,
                    {algorithms: ['RS256']});
        } catch (err) {
            throw new ForbiddenError(err.message, err.name);
        }
    }

    await next();
};
