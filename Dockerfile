# Step 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the application using Nginx (Unprivileged/Non-root for Security)
FROM nginxinc/nginx-unprivileged:alpine-slim

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Copy the build output from the builder stage
COPY --from=builder /app/dist .

# Copy the custom nginx configuration for React Router
# Note: In unprivileged image, the default conf path is often slightly different or requires specific permissions,
# but replacing default.conf usually works. We'll use the standard one.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (must be > 1024 for non-root, usually 8080)
EXPOSE 8080

# Set the user to the non-root user (nginxinc/nginx-unprivileged already does this, but clarifying is good practice)
USER nginx

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
