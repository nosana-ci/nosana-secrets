const Router = require('koa-router');

const router = new Router();

const authenticated = require('./middleware/auth');
const authController = require('./controller/auth');
const secretController = require('./controller/secret');

router.post('/login', authController.login);
router.get('/secrets', secretController.getSecrets);

// Public routes
router.get('/', async ctx => {
    ctx.ok('Welcome to Nosana Secret Manager');
});

router.get('/health', async ctx => {
    ctx.ok();
});
module.exports = router;
