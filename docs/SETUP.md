# Setup Guide

## Prerequisites
- Node.js ≥ 24
- npm ≥ 10
- Docker & Docker Compose
- PostgreSQL client (psql)

## Local Development
```bash
cp .env.example .env
npm install
npm run dev
```

## Database
```bash
docker-compose up -d postgres
npm run migrate
npm run seed
```

## Running Tests
```bash
npm run lint
npm run type-check
npm run test
npm run e2e
npm run playwright
```

## Docker
```bash
docker-compose up --build
```

## Environment Variables
- `DATABASE_URL` – PostgreSQL connection URI.
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_TTL`.
- `COOKIE_SECRET`.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.
- `SENTRY_DSN`.
- `CORS_WHITELIST` – Comma-separated origins.

## Production Notes
- Use managed Postgres with connection pooling (PgBouncer).
- Set `NODE_ENV=production`.
- Configure log directory persistent volume.
