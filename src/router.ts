import KoaRouter from "koa-router";

const router = new KoaRouter();

import authenticated from "./middleware/auth";
import authController from "./controller/auth";
import secretController from "./controller/secret";

console.log(secretController.getSecrets);

router.post("/login", authController.login);
router.get("/secrets", authenticated, secretController.getSecrets);
router.post("/secrets", authenticated, secretController.setSecrets);
router.delete("/secrets", authenticated, secretController.deleteSecret);

// Public routes
router.get("/", async (ctx: any) => {
  ctx.ok("Welcome to Nosana Secret Manager");
});

router.get("/health", async (ctx: any) => {
  ctx.ok();
});

export { router };
