# Security Posture

## Controls
- **Authentication**: JWT (HttpOnly, SameSite=strict), refresh tokens, OAuth2 Google.
- **Authorization**: Role-based + fine-grained permissions.
- **Input Validation**: zod schemas, sanitize-html, HPP guard.
- **Rate Limiting**: Configurable per environment.
- **CSP & Headers**: Strict CSP, HSTS, referrer-policy, X-Frame-Options disabled.
- **CSRF**: Tokens for state-changing requests, validated from header + secure cookie.
- **Logging Hygiene**: Sensitive fields redacted, retention (3d test / 30d prod).
- **Secrets**: `.env` management, recommend Vault or AWS Secrets Manager in production.
- **Dependencies**: Weekly Dependabot, `npm audit` in CI.

## Incident Response
1. Engage on-call.
2. Capture logs & Sentry traces.
3. Rotate credentials if compromised.
4. Follow post-mortem template.

## Hardening Checklist
- Enable TLS termination upstream (e.g., Nginx, ALB).
- Enforce MFA on CI/CD.
- Monitor `/metrics` via Prometheus.
- Configure Prisma to use TLS connections.
