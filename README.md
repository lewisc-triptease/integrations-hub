# Integrations Hub

A unified monorepo application for managing integrations with Hono, TypeScript, and Bun.

## Structure

```
integrations-hub/
├── src/
│   ├── app.ts                 # Main Hono application
│   ├── index.ts              # Application entry point
│   ├── layout.tsx            # Main layout component
│   ├── data-source/          # Data fetching logic
│   │   └── google/
│   │       ├── download.ts   # Google Sheets API integration
│   │       ├── parse.ts      # CSV parsing logic
│   │       └── types.ts      # Type definitions
│   ├── middleware/           # Hono middleware
│   │   ├── trace.ts         # Trace ID middleware
│   │   └── response.ts      # Response utilities
│   ├── routes/              # Route handlers
│   │   ├── api.ts          # API routes
│   │   └── ui.ts           # UI routes
│   ├── services/           # Business logic services
│   │   └── integrations.ts # Integration data service
│   ├── home/              # Homepage components
│   │   ├── handler.ts     # Homepage route handler
│   │   └── home.tsx       # Homepage component
│   ├── components/        # Reusable components
│   └── styles/           # CSS styles
├── test/                 # Test files
│   └── data-source/
│       └── google/
│           ├── parse.test.ts
│           └── fixtures/
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Features

- **Unified Application**: Single Hono app serving both API and UI
- **Trace ID Middleware**: Request tracing throughout the application
- **Data Fetching**: Google Sheets integration for configuration data
- **TypeScript**: Full type safety
- **Testing**: Comprehensive test suite
- **Modern Stack**: Hono, Bun, TypeScript, JSX

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   export SHEET_NAME="your-sheet-id"
   export SHEET_GID="your-sheet-gid"
   ```

3. Run the development server:
   ```bash
   bun run dev
   ```

4. Access the application:
   - UI: http://localhost:9898
   - API: http://localhost:9898/api/integrations
   - Health: http://localhost:9898/health

## Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run test` - Run tests
- `bun run type-check` - TypeScript type checking
- `bun run lint` - ESLint linting

## Architecture

The application follows a clean architecture pattern:

- **Routes**: Handle HTTP requests and responses
- **Services**: Business logic and data operations
- **Data Sources**: External API integrations
- **Middleware**: Cross-cutting concerns like tracing
- **Components**: Reusable UI components

All requests are traced with unique trace IDs for debugging and monitoring. 