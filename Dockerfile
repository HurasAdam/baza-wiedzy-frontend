# 1. Use the official Node.js 22 image as the base
FROM node:22

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy dependency files (package.json and package-lock.json if present)
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the remaining source files into the container
COPY . .

# 6. Build the frontend application (Vite + TypeScript)
RUN npm run build

# 7. Install a static file server globally
RUN npm install -g serve

# 8. Expose port 5173 (the frontend will be available here)
EXPOSE 5173

# 9. Start the app by serving static files from the dist directory
CMD ["serve", "-s", "dist", "-l", "5173"]
