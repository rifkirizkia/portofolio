# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code and build application
COPY . .
RUN npm run build

# Stage 2: Production Server (Nginx)
FROM nginx:alpine

# Copy built output to Nginx static serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
