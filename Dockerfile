FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip curl && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Railway provides the PORT automatically
EXPOSE 8080

CMD ["node", "server.js"]
