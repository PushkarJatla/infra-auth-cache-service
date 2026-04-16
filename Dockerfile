# Use official Node.js LTS image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) before the other files
# This leverages Docker caching to prevent reinstalling dependencies unless packages change
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Generate Prisma Client (needed before the app starts if not using volume mount)
RUN npx prisma generate

# Expose the API port
EXPOSE 5000

# Start command (nodemon for development)
CMD ["npm", "run", "dev"]
