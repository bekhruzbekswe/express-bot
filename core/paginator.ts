import { InlineKeyboard } from "../utils/ui/keyboards.ts";
import { escapeHtml as e } from "../utils/ui/escape.html.ts";
import { Identifiable, PaginatorOptions } from "./base/base.types.ts";

export function paginator<T extends Identifiable>({
  model,
  data,
  total,
  page,
  perPage,
  renderItem,
}: PaginatorOptions<T>): { text: string; keyboard: InlineKeyboard } {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const text =
    `<b>${
      model.charAt(0).toUpperCase() + model.slice(1)
    } (page ${page}/${totalPages})</b>\n\n` +
    data
      .map((item, i) =>
        `<b>${(page - 1) * perPage + i + 1}.</b> ${e(renderItem(item))}`
      )
      .join("\n\n");

  const keyboard = new InlineKeyboard();

  data.forEach((item, i) =>
    keyboard.text(`${(page - 1) * perPage + i + 1}`, `view:${model}:${item.id}`)
  );
  keyboard.row();

  if (page > 1) keyboard.text("⬅️", `list:${model}:${page - 1}`);
  if (page < totalPages) keyboard.text("➡️", `list:${model}:${page + 1}`);
  keyboard.row();

  return { text, keyboard };
}
