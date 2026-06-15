# Build the Vite frontend
FROM node:20-slim AS builder
WORKDIR /app

COPY app/package*.json ./app/
RUN cd app && npm install

COPY app/ ./app/

ARG VITE_ELEVENLABS_VOICE_ID
ENV VITE_ELEVENLABS_VOICE_ID=$VITE_ELEVENLABS_VOICE_ID

RUN cd app && npm run build

# Runtime image
FROM node:20-slim
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY api/ ./api/
COPY server.js ./
COPY --from=builder /app/app/dist ./app/dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
