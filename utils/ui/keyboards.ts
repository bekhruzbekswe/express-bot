export class Keyboard {
  private rows: { text: string }[][] = [];
  private currentRow: { text: string }[] = [];
  private resize = false;
  private oneTime = false;

  text(label: string) {
    this.currentRow.push({ text: label });
    return this;
  }

  row() {
    if (this.currentRow.length > 0) {
      this.rows.push(this.currentRow);
      this.currentRow = [];
    }
    return this;
  }

  resized() {
    this.resize = true;
    return this;
  }

  oneTimeKeyboard(value = true) {
    this.oneTime = value;
    return this;
  }

  toJSON() {
    if (this.currentRow.length) this.row();
    return {
      keyboard: this.rows,
      resize_keyboard: this.resize,
      one_time_keyboard: this.oneTime,
    };
  }
}

export class InlineKeyboard {
  private rows: { text: string; callback_data?: string; url?: string }[][] = [];
  private currentRow: { text: string; callback_data?: string; url?: string }[] =
    [];

  text(label: string, data?: string) {
    this.currentRow.push({ text: label, callback_data: data });
    return this;
  }

  url(label: string, url: string) {
    this.currentRow.push({ text: label, url });
    return this;
  }

  row() {
    if (this.currentRow.length > 0) {
      this.rows.push(this.currentRow);
      this.currentRow = [];
    }
    return this;
  }

  toJSON() {
    if (this.currentRow.length) this.row();
    return {
      inline_keyboard: this.rows,
    };
  }
}
