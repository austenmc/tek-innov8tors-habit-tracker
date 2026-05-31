# Habit Tracker GraphQL Backend

A minimal Apollo Server implementation for teaching purposes. All data is stored in-memory (resets on server restart).

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or with auto-reload on file changes
npm run dev
```

The server runs at **http://localhost:4000**

Open this URL in a browser to access Apollo Sandbox, an interactive GraphQL playground.

## API Overview

### Types

```graphql
type Habit {
  id: ID!
  name: String!
  createdAt: String!
}

type Completion {
  habitId: ID!
  date: String!  # YYYY-MM-DD format
}
```

### Queries

| Query | Description |
|-------|-------------|
| `habits(limit, offset)` | Get paginated list of habits |
| `habit(id)` | Get single habit by ID |
| `completions(startDate, endDate)` | Get completions in date range |

### Mutations

| Mutation | Description |
|----------|-------------|
| `createHabit(name)` | Create a new habit |
| `deleteHabit(id)` | Delete a habit and its completions |
| `toggleCompletion(habitId, date)` | Toggle completion on/off |

## Sample Requests (curl)

### Create a Habit

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createHabit(name: \"Morning Exercise\") { id name createdAt } }"
  }'
```

Response:
```json
{
  "data": {
    "createHabit": {
      "id": "1",
      "name": "Morning Exercise",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Get All Habits

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { habits { habits { id name } totalCount } }"
  }'
```

Response:
```json
{
  "data": {
    "habits": {
      "habits": [
        { "id": "1", "name": "Morning Exercise" }
      ],
      "totalCount": 1
    }
  }
}
```

### Get Habits with Pagination

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { habits(limit: 5, offset: 0) { habits { id name } totalCount } }"
  }'
```

### Get Single Habit

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { habit(id: \"1\") { id name createdAt } }"
  }'
```

### Toggle Completion (Mark Complete)

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { toggleCompletion(habitId: \"1\", date: \"2024-01-15\") { habitId date } }"
  }'
```

Response when toggled ON:
```json
{
  "data": {
    "toggleCompletion": {
      "habitId": "1",
      "date": "2024-01-15"
    }
  }
}
```

Response when toggled OFF (run same command again):
```json
{
  "data": {
    "toggleCompletion": null
  }
}
```

### Get Completions for Date Range

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { completions(startDate: \"2024-01-01\", endDate: \"2024-01-31\") { completions { habitId date } totalCount } }"
  }'
```

### Delete a Habit

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { deleteHabit(id: \"1\") }"
  }'
```

## Sample Workflow

Here's a complete workflow to test the API:

```bash
# 1. Create some habits
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createHabit(name: \"Exercise\") { id } }"}' | jq

curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createHabit(name: \"Read 30 minutes\") { id } }"}' | jq

curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createHabit(name: \"Meditate\") { id } }"}' | jq

# 2. List all habits
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query": "{ habits { habits { id name } totalCount } }"}' | jq

# 3. Mark some habits complete for today
TODAY=$(date +%Y-%m-%d)

curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { toggleCompletion(habitId: \\\"1\\\", date: \\\"$TODAY\\\") { habitId date } }\"}" | jq

curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { toggleCompletion(habitId: \\\"3\\\", date: \\\"$TODAY\\\") { habitId date } }\"}" | jq

# 4. Check today's completions
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ completions(startDate: \\\"$TODAY\\\", endDate: \\\"$TODAY\\\") { completions { habitId date } totalCount } }\"}" | jq
```

## Architecture Notes

This server demonstrates:

1. **Apollo Server Standalone** - No Express needed, minimal setup
2. **In-Memory Storage** - Simple JavaScript objects as a data store
3. **GraphQL Schema** - Type definitions using SDL (Schema Definition Language)
4. **Resolvers** - Functions that fetch/modify data for each field
5. **Pagination** - Simple offset-based pagination with totalCount

For production, you would replace the in-memory store with a real database (PostgreSQL, MongoDB, etc.).
