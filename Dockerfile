# Step 1: Build the React app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the app with nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
