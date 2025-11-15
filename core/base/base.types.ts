import type { Update, User as TelegramUser } from "grammy_types";
import { Ctx } from "../context.ts";

// Telegram
export type { TelegramUser, Update };

// Router
export type Handler = (ctx: Ctx, error?: Error) => Promise<void> | void;
export type Middleware = (ctx: Ctx, next: () => Promise<void>) => Promise<void>;
export type Condition = (ctx: Ctx) => boolean;

// Repo
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

// Paginator
export type Identifiable = {
  id: number | string;
};

export type PaginatorOptions<T extends Identifiable> = {
  model: string;
  data: T[];
  total: number;
  page: number;
  perPage: number;
  renderItem: (item: T) => string;
};
