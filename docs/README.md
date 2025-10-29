# Boilerplate Node API

## Overview
Secure, production-grade Fastify + Prisma boilerplate for extensible backend services.

## Quick Start
1. `cp .env.example .env`
2. `npm install`
3. `npm run dev`

## Key Commands
- `npm run lint` – ESLint with security rules.
- `npm run test` – Jest unit suite (≥90% coverage enforced).
- `npm run e2e` – Supertest integration suite.
- `npm run docker:build` – Multi-stage container build validation.
- `npm run seed` – Seed baseline roles, users, audit logs.

## Validation Workflow
Refer to [CHECKLIST.md](./CHECKLIST.md) for release gates.

## Observability
- Metrics: `/metrics`
- Swagger UI: `/docs`
- Sentry DSN: configurable via `SENTRY_DSN`.

## Support
Document incidents, upgrades, or security advisories in issues.
