FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
# Using npm install to avoid lockfile mismatch during demo builds
RUN npm install

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# Runtime
EXPOSE 3000
CMD ["node", "dist/main.js"]
