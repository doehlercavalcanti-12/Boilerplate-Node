import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().min(0).max(65535).default(3000),
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgres://')),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1),
  JWT_TTL: z.string().default('900s'),
  COOKIE_SECRET: z.string().min(16),
  JWT_COOKIE_NAME: z.string().default('sid'),
  CORS_WHITELIST: z.string().default('http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api/v1/auth/google/callback'),
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
  LOG_DIR: z.string().default('./logs'),
  DATABASE_POOL_MIN: z.coerce.number().default(10),
  DATABASE_POOL_MAX: z.coerce.number().default(30),
  DATABASE_POOL_IDLE: z.coerce.number().default(10),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('1 minute'),
  RATE_LIMIT_ALLOW_LIST: z.string().default('')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.format());
  process.exit(1);
}

const envValues = parsed.data;

const allowList = envValues.RATE_LIMIT_ALLOW_LIST
  ? envValues.RATE_LIMIT_ALLOW_LIST.split(',').map((entry) => entry.trim()).filter(Boolean)
  : [];

export const env = {
  nodeEnv: envValues.NODE_ENV,
  isPrimary: process.env.NODE_APP_INSTANCE ? process.env.NODE_APP_INSTANCE === '0' : true,
  port: envValues.PORT,
  databaseUrl: envValues.DATABASE_URL,
  jwtSecret: envValues.JWT_SECRET,
  jwtIssuer: envValues.JWT_ISSUER,
  jwtTtl: envValues.JWT_TTL,
  jwtCookieName: envValues.JWT_COOKIE_NAME,
  jwtTtlSeconds: parseInt(envValues.JWT_TTL, 10) || 900,
  cookieSecret: envValues.COOKIE_SECRET,
  corsWhitelist: envValues.CORS_WHITELIST.split(',').map((origin) => origin.trim()),
  googleClientId: envValues.GOOGLE_CLIENT_ID,
  googleClientSecret: envValues.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: envValues.GOOGLE_CALLBACK_URL,
  sentryDsn: envValues.SENTRY_DSN ?? '',
  logLevel: envValues.LOG_LEVEL,
  logDir: envValues.LOG_DIR,
  rateLimit: {
    max: envValues.RATE_LIMIT_MAX,
    window: envValues.RATE_LIMIT_WINDOW,
    allowList
  },
  pool: {
    min: envValues.DATABASE_POOL_MIN,
    max: envValues.DATABASE_POOL_MAX,
    idleTimeoutSeconds: envValues.DATABASE_POOL_IDLE
  }
} as const;
