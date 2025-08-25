FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./

RUN bun install --ci

COPY src ./src
COPY public ./public

RUN bun run build

FROM oven/bun:1.2-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 8080

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY bun.lock package.json ./
RUN bun install --production --frozen-lockfile

ENV PORT=8080
ENV LOG_LEVEL=info

CMD ["bun", "run", "dist/index.js"]

