# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /srv
COPY package.json package-lock.json* ./
# To copy on Stage 3 only prod dependecies.
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /srv
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build:amvera

# Stage 3: Production
FROM node:20-alpine AS runner
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
