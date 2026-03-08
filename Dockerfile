FROM node:18

RUN apt-get update && apt-get install -y ffmpeg python3-pip
RUN pip install yt-dlp

WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "start"]
