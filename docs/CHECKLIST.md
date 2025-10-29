# Release Checklist

## Pre-Commit
- [ ] Husky pre-commit hooks executed (lint-staged, unit tests).
- [ ] Commit message follows Conventional Commits.

## Pull Request Quality Gates
- [ ] ESLint (security rules) – PASS
- [ ] TypeScript type-check – PASS
- [ ] Jest unit tests with ≥90% coverage – PASS
- [ ] Supertest integration tests – PASS
- [ ] Playwright flows – PASS
- [ ] Docker build validation – PASS
- [ ] Security scan (CodeQL / npm audit) – PASS
- [ ] Markdown reports for lint/test/security uploaded.

## Deployment
- [ ] Prisma migrations applied.
- [ ] Seeds executed for roles & permissions.
- [ ] Sentry DSN configured.
- [ ] Metrics endpoint scraped by monitoring stack.

## Post-Deployment
- [ ] Verify login + OAuth flows.
- [ ] Confirm RBAC restrictions.
- [ ] Check log rotation and retention policy.
- [ ] Mark release as “Verified ✅”.
