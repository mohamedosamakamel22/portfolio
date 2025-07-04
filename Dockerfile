FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build the application
RUN cd backend && npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 