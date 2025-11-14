import { Ctx } from "../core/context.ts";
import { Keyboard } from "../utils/ui/keyboards.ts";
import { helloView } from "../views/hello.view.ts";

export async function handleStart(ctx: Ctx) {
  const menu = new Keyboard()
    .text("📝 Logs")
    .text("📊 Stats")
    .row()
    .text("❓ Help")
    .resized();

  await ctx.sendMessage(
    helloView(ctx.from.first_name),
    { reply_markup: menu },
  );
}
