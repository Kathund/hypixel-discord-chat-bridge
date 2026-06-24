FROM node:22.22.3-alpine
ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
COPY config.json ./config.json 2>/dev/null || true

ENTRYPOINT ["pnpm", "start"]
