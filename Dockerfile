# syntax=docker/dockerfile:1.7
FROM node:24-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

FROM deps AS builder
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
COPY docs ./docs
RUN npm run build && npm prune --omit=dev

FROM base AS runtime
RUN addgroup -g 1001 nodejs && adduser -S -G nodejs -u 1001 nodejs
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]
