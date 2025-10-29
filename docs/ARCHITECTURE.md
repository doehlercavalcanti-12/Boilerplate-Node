# Architecture

## Runtime Stack
- **Node.js 24 (ESM)** with Fastify 5.
- **Prisma 6 + PostgreSQL** for persistence and migration management.
- **Pino + Sentry** for observability and error tracking.

## Module Layout
- `config/` – Environment validation (zod), logging, feature toggles.
- `controllers/` – Request/response orchestration, minimal logic.
- `services/` – Business logic, token issuance, OAuth, RBAC evaluation.
- `repositories/` – Prisma data access, transactional helpers.
- `middlewares/` – Authentication, RBAC, security headers, AsyncLocalStorage.
- `schemas/` – zod schemas with automatic OpenAPI registration.
- `routes/` – Versioned route declarations.
- `utils/` – Crypto, sanitizers, helpers.
- `logs/` – Logger instantiation and HTTP bindings.

## Request Lifecycle
1. **Fastify hooks** assign `requestId`, bind AsyncLocalStorage, and enforce rate limits.
2. **Security middlewares** handle CSP, CSRF, sanitization.
3. **Controllers** delegate to services with sanitized payloads.
4. **Services** call repositories using scoped Prisma transactions.
5. **Responses** pass through Pino serializers, masking sensitive data.
6. **Errors** propagate to Sentry and standardized HTTP responses.

## Database Strategy
- Pool size tuned via `env.database.pool` (min 10 / max 30).
- Idle timeout 10 seconds; overflow requests queue with Fastify backpressure.
- `AuditLog` table retains logs for 30 days by default; cleanup job uses `expiresAt`.

## Testing Strategy
- Jest unit tests cover services, utils.
- Supertest integration ensures HTTP-level flows.
- Playwright request API for OAuth scenarios.
- Coverage gating at 90% globally.

## Deployment Notes
- Docker multi-stage ensures minimal runtime image.
- GitHub Actions run lint/type/test/build/coverage.
- Dependabot updates dependencies weekly.

## Extensibility Guidelines
- Add new domains by creating schema -> repository -> service -> controller -> route modules.
- Use RBAC middleware to guard endpoints; define permissions in Prisma and seeds.
