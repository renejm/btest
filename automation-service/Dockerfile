# Stage 1: build
FROM node:22-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: prod
FROM node:22-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN apk add --no-cache curl

CMD ["node", "dist/main"]
