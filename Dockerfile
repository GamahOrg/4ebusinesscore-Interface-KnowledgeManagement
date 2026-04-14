# Stage 1: Build
FROM node:20.11.1-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/gateway/package.json ./packages/gateway/

RUN npm install --legacy-peer-deps

COPY . .

WORKDIR /app/packages/gateway
RUN npm run build

# Stage 2: Runtime using serve
FROM node:20.11.1-alpine
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/packages/gateway/build ./knowledgemanagement

# Copy env injection script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
