import { Logger } from "../utils/logger.ts";
import { Condition, Handler, Middleware } from "./base/base.types.ts";
import { Ctx } from "./context.ts";

export class Router {
  private routes: { condition: Condition; handler: Handler }[] = [];
  private middlewares: Middleware[] = [];
  private errorHandler?: Handler;

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  on(condition: Condition, handler: Handler) {
    this.routes.push({ condition, handler });
    return this;
  }

  onError(handler: Handler) {
    this.errorHandler = handler;
    return this;
  }

  async handle(ctx: Ctx) {
    try {
      let index = 0;
      const next = async (): Promise<void> => {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index++];
          await middleware(ctx, next);
        } else {
          for (const route of this.routes) {
            if (route.condition(ctx)) {
              await route.handler(ctx);
              return;
            }
          }
          await ctx.sendMessage(
            "🤔 I didn't understand that. Use /start to see available commands.",
          );
        }
      };

      await next();
    } catch (error) {
      Logger.error("Uncaught error in Router", error as Error, {
        updateId: ctx.update.update_id,
        userId: ctx.from?.id,
      });

      if (this.errorHandler) {
        await this.errorHandler(ctx, error as Error);
      } else {
        await ctx.sendMessage("An error occured and our team is notified");
      }
    }
  }
}
