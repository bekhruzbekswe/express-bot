import { Middleware } from "../core/base/base.types.ts";
import { supabase } from "../core/supabase.ts";
import { Logger } from "../utils/logger.ts";

export const ensureUser: Middleware = async (ctx, next) => {
  if (ctx.from.is_bot) return next();

  const { error } = await supabase.from("users").upsert({
    id: ctx.from.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
  });

  if (error) {
    Logger.error("Error in saving a user in db", error);
    throw new Error("Error in saving a user in db");
  }

  await next();
};
