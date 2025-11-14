export function escapeHtml(text: string): string {
  return text.replace(
    /[&<>]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]!),
  );
}
