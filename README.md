# Integrations Hub

A modern monorepo for integrations hub with server and UI layers, built with Bun and TypeScript.

## Project Structure

```
integrations-hub/
├── packages/
│   ├── server/     # Backend API server
│   └── ui/         # Frontend Next.js application
├── package.json    # Root package configuration
└── tsconfig.json   # Root TypeScript configuration
```

## Prerequisites

- Node.js 22+
- Bun 1.0+

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start development servers:**
   ```bash
   bun run dev
   ```
   This will start both the server (port 3001) and UI (port 3000) in parallel.

3. **Build all packages:**
   ```bash
   bun run build
   ```

4. **Run tests:**
   ```bash
   bun run test
   ```

5. **Type checking:**
   ```bash
   bun run type-check
   ```

## Development

### Server Package
- Located in `packages/server/`
- Development server with hot reload: `bun run --cwd packages/server dev`

### UI Package
- Located in `packages/ui/`
- Development server: `bun run --cwd packages/ui dev`

## Scripts

- `bun run dev` - Start both development servers
- `bun run build` - Build all packages
- `bun run test` - Run tests for all packages
- `bun run lint` - Lint all packages
- `bun run clean` - Clean build artifacts
- `bun run type-check` - Type check all packages

## Technology Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Backend:** Express.js
- **Frontend:** Next.js 14, React 18
- **Styling:** Tailwind CSS
- **Linting:** ESLint
- **Formatting:** Prettier 