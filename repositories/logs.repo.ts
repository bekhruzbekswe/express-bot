import { BaseRepo } from "../core/base/base.repo.ts";
import { LogEntry } from "../types.ts";

export class LogsRepo extends BaseRepo<LogEntry> {
  constructor() {
    super("logs");
  }
}
