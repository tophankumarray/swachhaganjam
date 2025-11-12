# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Expose your server port
EXPOSE 8002

# Set environment variables (use .env in production or pass at runtime)
ENV NODE_ENV=production

# Start the app
CMD ["node", "server.js"]