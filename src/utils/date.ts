/**
 * Date utility functions for the Habit Tracker.
 * Centralizing date logic makes it easier to test and maintain.
 */

/**
 * Returns today's date in YYYY-MM-DD format.
 * This format is used as the key for completion records.
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Formats a date string for display.
 * Example: "2024-01-15" -> "January 15, 2024"
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
