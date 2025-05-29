FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Optimalisasi build
ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN npx prisma generate
RUN npm run build
