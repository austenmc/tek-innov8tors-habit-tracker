/**
 * Type definitions for the Habit Tracker app.
 * Keeping types separate makes them easy to import and understand.
 */

// A single habit that the user wants to track
export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO date string
}

// Maps habit IDs to their completion status for a specific date
// Example: { "habit-1": true, "habit-2": false }
export type CompletionRecord = Record<string, boolean>;

// Maps dates (YYYY-MM-DD format) to completion records
// This allows tracking completions across multiple days
// Example: { "2024-01-15": { "habit-1": true } }
export type CompletionsByDate = Record<string, CompletionRecord>;

// The complete state managed by our reducer
export interface HabitState {
  habits: Habit[];
  completions: CompletionsByDate;
  isLoaded: boolean; // Tracks if we've loaded from AsyncStorage
}

// All possible actions our reducer can handle
export type HabitAction =
  | { type: "ADD_HABIT"; payload: { name: string } }
  | { type: "TOGGLE_COMPLETE"; payload: { habitId: string; date: string } }
  | { type: "LOAD_STATE"; payload: { habits: Habit[]; completions: CompletionsByDate } }
  | { type: "DELETE_HABIT"; payload: { habitId: string } };
