const Router = require('koa-router');

const router = new Router();

// const authenticated = require('./middleware/auth');
// const admin = require('./middleware/admin');

// const authController = require('./controller/auth');
// const userController = require('./controller/user');
// const generalController = require('./controller/general');


// Public routes
router.get('/', async ctx => {
    ctx.ok();
});

router.get('/health', async ctx => {
    ctx.ok();
});
module.exports = router;
