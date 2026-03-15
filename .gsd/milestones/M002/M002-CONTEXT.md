# M002: PostgreSQL Integration

## Context

M001 delivered the monorepo template with SQLite as the default database. The `packages/db` package already has PG schema and client files (`src/pg/`), but no app or Docker config uses them. All apps are hardwired to SQLite's synchronous API (`.all()`, `.get()`, `.run()`).

## Problem

- Apps use SQLite-specific synchronous Drizzle methods — PG requires async
- Docker Compose has no PostgreSQL service
- No mechanism to switch between SQLite and PG at runtime
- No migration workflow for PG

## Approach

Introduce a `DB_DRIVER` env variable (`sqlite` | `pg`, default `sqlite`). The `packages/db` package exposes a unified async `createDatabase()` factory. All app query code becomes async. Docker Compose gets a PostgreSQL service. Default experience (no config) stays SQLite.

## Constraints

- Must not break existing SQLite zero-config experience
- Both drivers share the same query interface (async)
- Schema definitions stay separate (SQLite vs PG column types differ)
