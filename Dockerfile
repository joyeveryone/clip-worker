FROM node:18-bullseye

# Install dependencies needed for clipping
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip curl && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --no-cache-dir yt-dlp

# App directory
WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Railway will use this port
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
