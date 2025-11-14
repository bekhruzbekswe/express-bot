import {
  answerCallbackQuery,
  deleteMessageText,
  editMessage as editMessageText,
  sendMessage,
} from "./telegram.ts";
import { Logger } from "../utils/logger.ts";
import { InlineKeyboard, Keyboard } from "../utils/ui/keyboards.ts";
import { TelegramUser, Update } from "./base/base.types.ts";

export class Ctx {
  constructor(public readonly update: Update) {}

  get message() {
    return this.update.message;
  }

  get text() {
    return this.update.message?.text ?? "";
  }

  get voice() {
    return this.message?.voice;
  }

  get chatId() {
    return this.message?.chat.id ??
      this.callbackQuery?.message?.chat.id;
  }

  get voiceDuration(): number {
    return this.voice?.duration ?? 0;
  }

  get from(): TelegramUser {
    const user = this.update.message?.from ||
      this.update.callback_query?.from ||
      this.update.inline_query?.from;

    if (!user) {
      Logger.error("User is not found in ctx.from");
      throw new Error("User not found");
    }

    return user;
  }

  get callbackQuery() {
    return this.update.callback_query;
  }

  get query() {
    return this.callbackQuery?.data || "";
  }

  sendMessage(
    text: string,
    options?: {
      reply_markup?: Keyboard | InlineKeyboard;
    },
  ) {
    if (!this.chatId) throw new Error("Cannot reply: chat ID not found");

    let reply_markup;
    if (options?.reply_markup) {
      reply_markup = options.reply_markup.toJSON?.() ?? options.reply_markup;
    }

    return sendMessage(this.chatId, text, { reply_markup });
  }

  answerCallback(text?: string) {
    const id = this.callbackQuery?.id;
    if (!id) {
      Logger.warn("Error in answering callback: Missing callback ID");
      return;
    }
    return answerCallbackQuery(id, text);
  }

  editMessage(
    text: string,
    options?: {
      reply_markup?: Keyboard | InlineKeyboard;
    },
  ) {
    const msg = this.callbackQuery?.message;
    if (!msg) throw new Error("Cannot edit message: No message in callback");

    let reply_markup;
    if (options?.reply_markup) {
      reply_markup = options.reply_markup.toJSON?.() ?? options.reply_markup;
    }

    return editMessageText(msg.chat.id, msg.message_id, text, { reply_markup });
  }

  deleteMessage() {
    const messageId = this.callbackQuery?.message?.message_id;
    if (!messageId || !this.chatId) {
      throw new Error(
        "Could not delete a message, missing chat id or message id",
      );
    }
    return deleteMessageText(this.chatId, messageId);
  }

  reply(
    text: string,
    options?: {
      reply_markup?: Keyboard | InlineKeyboard;
      parse_mode?: "HTML" | "MarkdownV2";
    },
  ) {
    const opts = { ...options, parse_mode: options?.parse_mode ?? "HTML" };

    if (this.callbackQuery) {
      this.editMessage(text, opts);
    } else {
      this.sendMessage(text, opts);
    }
  }
}
