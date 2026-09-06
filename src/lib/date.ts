/** The browser's local calendar day as YYYY-MM-DD (not the server's UTC day). */
export function localDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA").format(date);
}
