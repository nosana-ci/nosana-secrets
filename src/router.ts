import KoaRouter from 'koa-router';
import { Context } from 'koa';

const router: KoaRouter = new KoaRouter();

import authenticated from './middleware/auth';
import authController from './controller/auth';
import secretController from './controller/secret';

router.post('/login', authController.login);
router.get('/secrets', authenticated, secretController.getSecrets);
router.post('/secrets', authenticated, secretController.setSecrets);
router.delete('/secrets', authenticated, secretController.deleteSecret);

// Public routes
router.get('/', async (ctx: Context): Promise<void> => {
  ctx.ok('Welcome to Nosana Secret Manager');
});

router.get('/health', async (ctx: Context): Promise<void> => {
  ctx.ok();
});

export { router };
