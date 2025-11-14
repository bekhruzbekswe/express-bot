import { Router } from "./core/router.ts";
import { handleStart } from "./handlers/start.ts";
import { ensureUser } from "./middlewares/ensureUser.ts";

export const router = new Router();
router.use(ensureUser);

// Routes
router.on((ctx) => ctx.text === "/start", handleStart);
