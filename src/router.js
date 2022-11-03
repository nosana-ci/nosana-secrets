const Router = require('koa-router');

const router = new Router();

const authenticated = require('./middleware/auth');
const authController = require('./controller/auth');
const secretController = require('./controller/secret');

router.post('/login', authController.login);
router.get('/secrets', authenticated, secretController.getSecrets);
router.post('/secrets', authenticated, secretController.setSecrets);


// Public routes
router.get('/', async ctx => {
    ctx.ok('Welcome to Nosana Secret Manager');
});

router.get('/health', async ctx => {
    ctx.ok();
});
module.exports = router;
