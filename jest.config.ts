/* eslint-disable no-useless-escape */
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit'],
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: 'inline',
        module: { type: 'es6' },
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true
          },
          transform: {
            decoratorMetadata: true
          }
        }
      }
    ]
  },
  transformIgnorePatterns: ['/node_modules/(?!jose/)'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/utils/**/*.ts'],
  moduleNameMapper: {
    '^\./env\.js$': '<rootDir>/src/config/env.ts',
    '^\./config/env\.js$': '<rootDir>/src/config/env.ts',
    '^\./config/logging\.js$': '<rootDir>/src/config/logging.ts',
    '^\./logs/logger\.js$': '<rootDir>/src/logs/logger.ts',
    '^\./routes/index\.js$': '<rootDir>/src/routes/index.ts',
    '^\./middlewares/request-context\.js$': '<rootDir>/src/middlewares/request-context.ts',
    '^\./middlewares/security-headers\.js$': '<rootDir>/src/middlewares/security-headers.ts',
    '^\./plugins/sentry\.js$': '<rootDir>/src/plugins/sentry.ts',
    '^\./db/prisma\.client\.js$': '<rootDir>/src/db/prisma.client.ts',
    '^\./v1/auth\.routes\.js$': '<rootDir>/src/routes/v1/auth.routes.ts',
    '^\./v1/admin\.routes\.js$': '<rootDir>/src/routes/v1/admin.routes.ts',
    '^\./request-context\.js$': '<rootDir>/src/middlewares/request-context.ts',
    '^\.\./config/env\.js$': '<rootDir>/src/config/env.ts',
    '^\.\./config/logging\.js$': '<rootDir>/src/config/logging.ts',
    '^\.\./schemas/auth\.schema\.js$': '<rootDir>/src/schemas/auth.schema.ts',
    '^\.\./services/auth\.service\.js$': '<rootDir>/src/services/auth.service.ts',
    '^\.\./repositories/user\.repository\.js$': '<rootDir>/src/repositories/user.repository.ts',
    '^\.\./utils/crypto\.js$': '<rootDir>/src/utils/crypto.ts',
    '^\.\./db/prisma\.client\.js$': '<rootDir>/src/db/prisma.client.ts',
    '^\.\./\.\./controllers/auth\.controller\.js$': '<rootDir>/src/controllers/auth.controller.ts',
    '^\.\./\.\./schemas/auth\.schema\.js$': '<rootDir>/src/schemas/auth.schema.ts',
    '^\.\./\.\./middlewares/authentication\.js$': '<rootDir>/src/middlewares/authentication.ts',
    '^\.\./\.\./middlewares/rbac\.js$': '<rootDir>/src/middlewares/rbac.ts',
    '^\.\./\.\./\.\./src/utils/crypto\.js$': '<rootDir>/src/utils/crypto.ts',
    '^\.\./\.\./\.\./src/utils/sanitizer\.js$': '<rootDir>/src/utils/sanitizer.ts',
    '^\.\./\.\./src/server\.js$': '<rootDir>/src/server.ts',
  },
  coverageThreshold: {
    global: {
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};

export default config;
