const reply = ctx => (statusCode, body) => {
    if (body) {
        body = JSON.stringify(body);
    }

    ctx.response.body = body;
    ctx.response.status = statusCode;
};

const ok = ctx => body => {
    ctx.reply(200, body);
};

module.exports = () => async (ctx, next) => {
    ctx.reply = reply(ctx);
    ctx.ok = ok(ctx);
    await next();
};
