const Router = require('koa-router');

const router = new Router();

const config = require('./generic/config');
const { Kevast } = require('kevast');
const { KevastFile } = require('kevast-file');
const { KevastEncrypt } = require('kevast-encrypt');

// const authenticated = require('./middleware/auth');
// const admin = require('./middleware/admin');

// const authController = require('./controller/auth');
// const userController = require('./controller/user');
// const generalController = require('./controller/general');


// Public routes
router.get('/', async ctx => {
    const fileStore = new KevastFile('./secrets/test.json');
    const kevast = new Kevast(fileStore);
    kevast.use(new KevastEncrypt(config.encryptionKey));
    await kevast.set('key2', 'test');
    const value = await kevast.get('key');

    ctx.ok(value);
});

router.get('/health', async ctx => {
    ctx.ok();
});
module.exports = router;
