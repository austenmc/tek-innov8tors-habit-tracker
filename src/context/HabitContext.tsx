/**
 * HabitContext - The central state management for our app.
 *
 * This file demonstrates the Context + useReducer pattern:
 * 1. Context provides state and dispatch to all components
 * 2. useReducer handles state updates via discrete actions
 * 3. SQLite persists state between app sessions
 *
 * Any component can read state or dispatch actions without prop drilling.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import * as Storage from "../utils/storage";
import {
  HabitState,
  HabitAction,
  Habit,
} from "../types/habit";

// Storage key for SQLite
const STORAGE_KEY = "habit-tracker-state";

// Initial state before loading from storage
const initialState: HabitState = {
  habits: [],
  completions: {},
  isLoaded: false,
};

/**
 * The reducer function handles all state updates.
 * Each action type corresponds to a specific state change.
 * This makes state changes predictable and easy to debug.
 */
function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    // Add a new habit to the list
    case "ADD_HABIT": {
      const newHabit: Habit = {
        id: Date.now().toString(), // Simple unique ID
        name: action.payload.name,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        habits: [...state.habits, newHabit],
      };
    }

    // Toggle a habit's completion status for a specific date
    case "TOGGLE_COMPLETE": {
      const { habitId, date } = action.payload;
      const dateCompletions = state.completions[date] || {};
      const currentStatus = dateCompletions[habitId] || false;

      return {
        ...state,
        completions: {
          ...state.completions,
          [date]: {
            ...dateCompletions,
            [habitId]: !currentStatus,
          },
        },
      };
    }

    // Load persisted state from storage
    case "LOAD_STATE": {
      return {
        habits: action.payload.habits,
        completions: action.payload.completions,
        isLoaded: true,
      };
    }

    // Delete a habit from the list
    case "DELETE_HABIT": {
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload.habitId),
      };
    }

    default:
      return state;
  }
}

// Context type definition
interface HabitContextType {
  state: HabitState;
  dispatch: React.Dispatch<HabitAction>;
}

// Create the context with undefined default (we'll check for this)
const HabitContext = createContext<HabitContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and provides habit state.
 * Handles loading from and saving to SQLite automatically.
 */
export function HabitProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load persisted state when the app starts
  useEffect(() => {
    async function loadState() {
      try {
        const stored = await Storage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({
            type: "LOAD_STATE",
            payload: {
              habits: parsed.habits || [],
              completions: parsed.completions || {},
            },
          });
        } else {
          // No stored data, just mark as loaded
          dispatch({
            type: "LOAD_STATE",
            payload: { habits: [], completions: {} },
          });
        }
      } catch (error) {
        console.error("Failed to load habits from storage:", error);
        dispatch({
          type: "LOAD_STATE",
          payload: { habits: [], completions: {} },
        });
      }
    }

    loadState();
  }, []);

  // Save state to SQLite whenever it changes
  useEffect(() => {
    // Don't save until we've loaded (prevents overwriting with empty state)
    if (!state.isLoaded) return;

    async function saveState() {
      try {
        const toStore = {
          habits: state.habits,
          completions: state.completions,
        };
        await Storage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch (error) {
        console.error("Failed to save habits to storage:", error);
      }
    }

    saveState();
  }, [state.habits, state.completions, state.isLoaded]);

  return (
    <HabitContext.Provider value={{ state, dispatch }}>
      {children}
    </HabitContext.Provider>
  );
}

/**
 * Custom hook to access the habit context.
 * Throws an error if used outside of HabitProvider.
 */
export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
