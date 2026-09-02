# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.15.4

# Copy root workspace configuration
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install dependencies and build Next.js app
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @ruralconnect/web run build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.js ./apps/web/next.config.js

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["./node_modules/.bin/next", "start", "-p", "3000"]
