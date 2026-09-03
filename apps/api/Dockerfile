# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.15.4

# Copy root workspace configuration
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies and build
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @ruralconnect/api run build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]

