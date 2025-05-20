# Stage 1 - Build
FROM node:22-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - Production
FROM node:22-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY .env .env

CMD ["node", "dist/main"]
