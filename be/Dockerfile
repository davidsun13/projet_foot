FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/Back ./Back

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 1234

CMD ["node", "Back/src/server.cjs"]
