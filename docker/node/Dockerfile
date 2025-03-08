FROM node:20.13.1-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install -g vite

# Copy package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY ./frontend .

# Expose the port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

