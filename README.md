# Habit Tracker

A simple React Native habit tracking app built with Expo. This app demonstrates **shared state management across screens** using the **Context + useReducer** pattern.

## Purpose

This app is designed as a teaching tool to show how to:
- Manage global state in React Native without external libraries
- Share state across multiple screens without prop drilling
- Persist data locally using AsyncStorage
- Use TailwindCSS (NativeWind) for styling in React Native

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
src/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root layout - wraps app with HabitProvider
│   ├── index.tsx           # Home screen - lists habits for today
│   └── add-habit.tsx       # Add habit screen - form to create habits
├── context/
│   └── HabitContext.tsx    # Global state management (Context + useReducer)
├── types/
│   └── habit.ts            # TypeScript type definitions
├── utils/
│   └── date.ts             # Date formatting utilities
└── global.css              # TailwindCSS directives
```

## State Management Pattern

This app uses **Context + useReducer** - a built-in React pattern for managing complex state:

### Why This Pattern?

1. **No external dependencies** - Uses only React's built-in hooks
2. **Predictable updates** - All state changes happen through discrete actions
3. **Easy to debug** - Actions describe exactly what happened
4. **Scalable** - Works well as the app grows

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                     HabitProvider                       │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │   state     │◄───│  reducer    │◄───│  dispatch  │  │
│  │  (habits,   │    │ (handles    │    │ (triggers  │  │
│  │ completions)│    │  actions)   │    │  actions)  │  │
│  └─────────────┘    └─────────────┘    └────────────┘  │
│         │                                     ▲        │
│         ▼                                     │        │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Any Screen Component               │   │
│  │   const { state, dispatch } = useHabits();      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Actions

The reducer handles these actions:

| Action | Description |
|--------|-------------|
| `ADD_HABIT` | Creates a new habit with name, id, and creation date |
| `TOGGLE_COMPLETE` | Toggles a habit's completion status for a specific date |
| `DELETE_HABIT` | Removes a habit from the list |
| `LOAD_STATE` | Loads persisted state from AsyncStorage |

### State Shape

```typescript
{
  habits: [
    { id: "1", name: "Exercise", createdAt: "2024-01-15T..." },
    { id: "2", name: "Read", createdAt: "2024-01-15T..." }
  ],
  completions: {
    "2024-01-15": { "1": true, "2": false },
    "2024-01-16": { "1": true }
  },
  isLoaded: true
}
```

## Key Files Explained

### `src/context/HabitContext.tsx`
The heart of state management. Contains:
- The reducer function that handles all state updates
- The provider component that wraps the app
- The `useHabits()` hook for accessing state
- AsyncStorage integration for persistence

### `src/app/_layout.tsx`
The root layout that:
- Imports global CSS for NativeWind
- Wraps the app with HabitProvider
- Configures the navigation stack

### `src/app/index.tsx`
The home screen that demonstrates:
- Reading state from context
- Dispatching the TOGGLE_COMPLETE action
- Conditional rendering based on state

### `src/app/add-habit.tsx`
The add habit screen that demonstrates:
- Local form state with useState
- Dispatching the ADD_HABIT action
- Programmatic navigation after action

## Technologies Used

- **Expo SDK 56** - React Native development platform
- **Expo Router** - File-based navigation
- **NativeWind v4** - TailwindCSS for React Native
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety

## Learning Resources

- [React useReducer Hook](https://react.dev/reference/react/useReducer)
- [React Context API](https://react.dev/reference/react/useContext)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
