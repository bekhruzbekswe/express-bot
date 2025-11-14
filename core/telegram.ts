const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const API = `https://api.telegram.org/bot${TOKEN}`;

async function callTelegram<T>(
  method: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram API error: ${res.status} ${text}`);
  }

  return res.json();
}

export function sendMessage(
  chatId: number,
  text: string,
  options: Record<string, unknown> = {},
) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode ?? "HTML",
    ...options,
  });
}

export function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  options: Record<string, unknown> = {},
) {
  return callTelegram("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: options.parse_mode ?? "HTML",
    ...options,
  });
}

export function answerCallbackQuery(id: string, text?: string) {
  return callTelegram("answerCallbackQuery", { callback_query_id: id, text });
}

export function deleteMessageText(chatId: number, messageId: number) {
  return callTelegram("deleteMessage", {
    chat_id: chatId,
    message_id: messageId,
  });
}
