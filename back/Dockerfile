# Build Stage
FROM node:lts-alpine AS build

WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:lts-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production
RUN npm cache clean --force

# Start the app
CMD ["node", "dist/src/main.js"]