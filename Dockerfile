# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@latest

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build the application
FROM deps AS builder
COPY . .
RUN pnpm run build

# Create the production image
FROM base AS runner

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy the built application and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Run the application
CMD ["node", "dist/server.js"]