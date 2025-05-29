# 1. Build stage
FROM node:18 AS builder

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files (including .env)
COPY . .

RUN npx prisma generate

# Build Next.js app
RUN npm run build

# 2. Production stage
FROM node:18-bullseye-slim

# Install required native dependencies (libssl1.1)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production build from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.env .env

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
