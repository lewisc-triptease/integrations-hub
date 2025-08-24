FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./

RUN bun install --ci

COPY src ./src
COPY public ./public

RUN bun run build

FROM oven/bun:1.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3000

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

ENV PORT='3000'
ENV GOOGLE_CLOUD_PROJECT='${GOOGLE_CLOUD_PROJECT}'
ENV SHEET_GID='${SHEET_GID}'
ENV SHEET_NAME='${SHEET_NAME}'
ENV LOG_LEVEL='info'

CMD ["bun", "run", "dist/index.js"]

