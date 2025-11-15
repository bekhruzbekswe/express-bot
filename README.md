# Express-Bot

A lightweight, minimalistic TypeScript framework for building Telegram bots with
Deno and an Express-like routing system.

## Features

- 🚀 Lightweight & minimalistic
- 🎯 Express-like router with middleware support
- ⌨️ Simple keyboard builders (reply & inline)
- 📄 Built-in pagination helper
- 🔍 Fully typed with TypeScript
- 🛡️ Centralized error handling

## Quick Start

### Setup

```bash
# Set environment variable
export TELEGRAM_BOT_TOKEN=your_bot_token
```

### Basic Bot

```typescript
import { Router } from "./core/router.ts";
import { Ctx } from "./core/context.ts";
import { InlineKeyboard, Keyboard } from "./utils/ui/keyboards.ts";

const router = new Router();

// Simple command
router.on((ctx) => ctx.text === "/start", async (ctx) => {
  await ctx.sendMessage("Welcome! 🚀");
});

// With keyboard
router.on((ctx) => ctx.text === "/menu", async (ctx) => {
  const keyboard = new Keyboard()
    .text("📝 Notes")
    .text("⚙️ Settings")
    .resized();

  await ctx.sendMessage("Choose:", { reply_markup: keyboard });
});

// Callback handler
router.on((ctx) => ctx.query.startsWith("btn:"), async (ctx) => {
  await ctx.answerCallback("Clicked!");
  await ctx.editMessage("Button pressed!");
});

// Start server
Deno.serve(async (req) => {
  const update = await req.json();
  await router.handle(new Ctx(update));
  return new Response("ok");
});
```

## Core API

### Context

```typescript
ctx.text; // Message text
ctx.chatId; // Chat ID
ctx.from; // User info
ctx.query; // Callback data

await ctx.sendMessage("Hello!");
await ctx.reply("Works for messages & callbacks");
await ctx.editMessage("Updated");
await ctx.deleteMessage();
await ctx.answerCallback("Done!");
```

### Router

```typescript
// Middleware
router.use(async (ctx, next) => {
  console.log("Before");
  await next();
  console.log("After");
});

// Routes
router.on((ctx) => ctx.text === "/start", handler);
router.on((ctx) => ctx.text.startsWith("/"), handleCommands);

// Error handling
router.onError(async (ctx, error) => {
  await ctx.sendMessage("Error occurred!");
});
```

### Keyboards

```typescript
// Reply keyboard
const keyboard = new Keyboard()
  .text("Button 1")
  .text("Button 2")
  .row()
  .text("Button 3")
  .resized();

// Inline keyboard
const inline = new InlineKeyboard()
  .text("Option 1", "callback:1")
  .text("Option 2", "callback:2")
  .row()
  .url("Website", "https://example.com");
```

### Pagination

```typescript
import { paginator } from "./core/paginator.ts";

const { text, keyboard } = paginator({
  model: "notes",
  data: items,
  total: 100,
  page: 1,
  perPage: 5,
  renderItem: (item) => item.title,
});

await ctx.sendMessage(text, { reply_markup: keyboard });
```

### Repository (Optional)

By default, Express-Bot includes a `BaseRepo` class for Supabase, but you can
swap it with any database:

```typescript
class NotesRepo extends BaseRepo<Note> {
  constructor() {
    super("notes");
  }
}

// CRUD operations
await repo.create({ content: "Note" });
await repo.getOne(id);
await repo.getMany(userId, page, perPage);
await repo.update(id, { content: "Updated" });
await repo.delete(id);
```

## Project Structure

```
├── core/
│   ├── context.ts                     # Context class
│   ├── router.ts                      # Router & middleware
│   ├── paginator.ts                   # Pagination helper
│   └── telegram.ts                    # Telegram API calls
├── utils/
│   ├── ui/
│   │   ├── keyboards.ts               # Keyboard builders
│   │   ├── escape.html.ts             # HTML escaping utility
│   │   └── escape.markdown.v2.ts      # MarkdownV2 escaping utility 
│   └── logger.ts                      # JSON logger
├── handlers/                          # Your handlers
├── views/                             # Telegram messages
├── middlewares/                       # Your middleware
└── main.ts                            # Entry point
```

## Run

```bash
deno run --allow-net --allow-env main.ts
```

## License

MIT
