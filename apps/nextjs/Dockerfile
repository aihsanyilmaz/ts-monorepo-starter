# ── Stage 1: Base ──────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app

# ── Stage 2: Install all deps (monorepo-wide) ─────────────────
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/nextjs/package.json ./apps/nextjs/
COPY apps/honojs/package.json ./apps/honojs/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

# ── Stage 3: Build ─────────────────────────────────────────────
FROM deps AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/env/ ./packages/env/
COPY packages/shared/ ./packages/shared/
COPY packages/db/ ./packages/db/
COPY apps/honojs/ ./apps/honojs/
COPY packages/api-client/ ./packages/api-client/
COPY apps/nextjs/ ./apps/nextjs/
RUN pnpm --filter @repo/shared build && \
    pnpm --filter @repo/env build && \
    pnpm --filter @repo/db build && \
    pnpm --filter @repo/honojs build && \
    pnpm --filter @repo/api-client build && \
    pnpm --filter @repo/nextjs build

# ── Stage 4: Production ───────────────────────────────────────
FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Next.js standalone output copies everything it needs
COPY --from=build /app/apps/nextjs/.next/standalone/ ./
COPY --from=build /app/apps/nextjs/.next/static/ ./apps/nextjs/.next/static/
COPY --from=build /app/apps/nextjs/public/ ./apps/nextjs/public/

EXPOSE 3000
CMD ["node", "apps/nextjs/server.js"]
