import { Ctx } from "./core/context.ts";
import { router } from "./routes.ts";
import { Logger } from "./utils/logger.ts";

Deno.serve(async (req) => {
  try {
    const update = await req.json();
    const ctx = new Ctx(update);
    await router.handle(ctx);

    return new Response("ok");
  } catch (e) {
    Logger.error("Error in main entry: ", e as Error);
    return new Response("error", { status: 500 });
  }
});
