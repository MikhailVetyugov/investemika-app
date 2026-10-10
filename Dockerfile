# Stage 1: Dependencies
FROM node:24-alpine AS deps
WORKDIR /srv
RUN npm install --global pnpm@12.10.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# To copy on Stage 3 only prod dependecies.
RUN pnpm install --prod --frozen-lockfile

# Stage 2: Build
FROM node:24-alpine AS builder
WORKDIR /srv
RUN npm install --global pnpm@12.10.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build:amvera

# Stage 3: Production
FROM node:24-alpine AS runner
WORKDIR /srv

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy all needed files to run app in the current (empty) directory.
COPY --from=deps --chown=nextjs:nodejs /srv/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /srv/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /srv/public ./public
COPY --from=builder --chown=nextjs:nodejs /srv/package.json ./package.json

RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start:amvera"]