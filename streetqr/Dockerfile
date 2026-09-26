# Multi-stage Dockerfile for Qzaar React Frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV REACT_APP_API_URL=http://localhost:5001
RUN npm run build

# Production serving stage via nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
