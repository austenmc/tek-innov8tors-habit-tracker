/**
 * Habit Tracker GraphQL Backend
 *
 * A minimal Apollo Server implementation for teaching purposes.
 * All data is stored in-memory (resets on server restart).
 *
 * Run with: npm start
 * GraphQL Playground: http://localhost:4000
 */

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// =============================================================================
// IN-MEMORY DATA STORE
// =============================================================================
// Simple key-value storage using JavaScript objects.
// In production, you'd replace this with a real database.

const store = {
  // Habits stored by ID: { "1": { id: "1", name: "Exercise", createdAt: "..." } }
  habits: {},

  // Completions stored by "habitId:date" key: { "1:2024-01-15": { habitId: "1", date: "2024-01-15" } }
  completions: {},

  // Auto-incrementing ID counter
  nextId: 1,
};

// Helper: Generate a unique ID
function generateId() {
  return String(store.nextId++);
}

// Helper: Get current ISO timestamp
function now() {
  return new Date().toISOString();
}

// =============================================================================
// GRAPHQL SCHEMA
// =============================================================================
// Defines the shape of our API - what data can be queried and mutated.

const typeDefs = `#graphql
  """
  A habit that the user wants to track daily.
  """
  type Habit {
    id: ID!
    name: String!
    createdAt: String!
  }

  """
  Represents a completed habit on a specific date.
  If a completion record exists, the habit was completed that day.
  """
  type Completion {
    habitId: ID!
    date: String!
  }

  """
  Paginated result for habits query.
  Includes totalCount for UI pagination controls.
  """
  type HabitsResult {
    habits: [Habit!]!
    totalCount: Int!
  }

  """
  Result for completions query.
  """
  type CompletionsResult {
    completions: [Completion!]!
    totalCount: Int!
  }

  # -----------------------------------------------------------------------------
  # QUERIES - Read operations
  # -----------------------------------------------------------------------------
  type Query {
    """
    Get a paginated list of all habits.
    - limit: Maximum number of habits to return (default: 10)
    - offset: Number of habits to skip (default: 0)
    """
    habits(limit: Int = 10, offset: Int = 0): HabitsResult!

    """
    Get a single habit by its ID.
    Returns null if not found.
    """
    habit(id: ID!): Habit

    """
    Get all completions within a date range.
    Dates should be in YYYY-MM-DD format.
    """
    completions(startDate: String!, endDate: String!): CompletionsResult!
  }

  # -----------------------------------------------------------------------------
  # MUTATIONS - Write operations
  # -----------------------------------------------------------------------------
  type Mutation {
    """
    Create a new habit with the given name.
    Returns the created habit.
    """
    createHabit(name: String!): Habit!

    """
    Delete a habit by ID.
    Also removes all associated completions.
    Returns true if deleted, false if not found.
    """
    deleteHabit(id: ID!): Boolean!

    """
    Toggle the completion status of a habit for a specific date.
    - If not completed: marks it as completed (returns the Completion)
    - If already completed: removes the completion (returns null)
    """
    toggleCompletion(habitId: ID!, date: String!): Completion
  }
`;

// =============================================================================
// RESOLVERS
// =============================================================================
// Functions that fetch/modify data for each field in the schema.

const resolvers = {
  Query: {
    // Get paginated habits
    habits: (_, { limit, offset }) => {
      // Get all habits as an array, sorted by creation date (newest first)
      const allHabits = Object.values(store.habits).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Apply pagination
      const paginatedHabits = allHabits.slice(offset, offset + limit);

      return {
        habits: paginatedHabits,
        totalCount: allHabits.length,
      };
    },

    // Get single habit by ID
    habit: (_, { id }) => {
      return store.habits[id] || null;
    },

    // Get completions in date range
    completions: (_, { startDate, endDate }) => {
      const allCompletions = Object.values(store.completions).filter(
        (c) => c.date >= startDate && c.date <= endDate
      );

      return {
        completions: allCompletions,
        totalCount: allCompletions.length,
      };
    },
  },

  Mutation: {
    // Create a new habit
    createHabit: (_, { name }) => {
      const id = generateId();
      const habit = {
        id,
        name: name.trim(),
        createdAt: now(),
      };

      store.habits[id] = habit;
      console.log(`Created habit: ${habit.name} (ID: ${id})`);

      return habit;
    },

    // Delete a habit and its completions
    deleteHabit: (_, { id }) => {
      if (!store.habits[id]) {
        return false;
      }

      // Remove the habit
      delete store.habits[id];

      // Remove all completions for this habit
      Object.keys(store.completions).forEach((key) => {
        if (key.startsWith(`${id}:`)) {
          delete store.completions[key];
        }
      });

      console.log(`Deleted habit ID: ${id}`);
      return true;
    },

    // Toggle completion status
    toggleCompletion: (_, { habitId, date }) => {
      // Verify habit exists
      if (!store.habits[habitId]) {
        throw new Error(`Habit with ID ${habitId} not found`);
      }

      const key = `${habitId}:${date}`;

      // If already completed, remove it (toggle off)
      if (store.completions[key]) {
        delete store.completions[key];
        console.log(`Removed completion: habit ${habitId} on ${date}`);
        return null;
      }

      // Otherwise, mark as completed (toggle on)
      const completion = { habitId, date };
      store.completions[key] = completion;
      console.log(`Added completion: habit ${habitId} on ${date}`);

      return completion;
    },
  },
};

// =============================================================================
// SERVER STARTUP
// =============================================================================

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`
🚀 Habit Tracker GraphQL Server ready!

   ${url}

📝 Example queries to try in Apollo Sandbox:

   query {
     habits {
       habits { id name createdAt }
       totalCount
     }
   }

   mutation {
     createHabit(name: "Morning Exercise") {
       id name createdAt
     }
   }

   mutation {
     toggleCompletion(habitId: "1", date: "2024-01-15") {
       habitId date
     }
   }
`);
