# Multi-stage Dockerfile for Qzaar Backend
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "index.js"]
