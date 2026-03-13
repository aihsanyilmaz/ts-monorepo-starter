# ── Stage 1: Base ──────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app

# ── Stage 2: Install all deps (monorepo-wide) ─────────────────
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/nestjs/package.json ./apps/nestjs/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

# ── Stage 3: Build ─────────────────────────────────────────────
FROM deps AS build
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/env/ ./packages/env/
COPY packages/shared/ ./packages/shared/
COPY packages/db/ ./packages/db/
COPY apps/nestjs/ ./apps/nestjs/
RUN pnpm --filter @repo/shared build && \
    pnpm --filter @repo/env build && \
    pnpm --filter @repo/db build && \
    pnpm --filter @repo/nestjs build

# ── Stage 4: Production ───────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/nestjs/package.json ./apps/nestjs/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/packages/env/dist/ ./packages/env/dist/
COPY --from=build /app/packages/shared/dist/ ./packages/shared/dist/
COPY --from=build /app/packages/db/dist/ ./packages/db/dist/
COPY --from=build /app/apps/nestjs/dist/ ./apps/nestjs/dist/

EXPOSE 3002
CMD ["node", "apps/nestjs/dist/main.js"]
