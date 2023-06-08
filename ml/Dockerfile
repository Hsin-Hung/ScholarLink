FROM node:18.16.0-alpine3.17
WORKDIR /app
COPY package*.json ./
RUN npm install
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.11.0/wait /wait
RUN chmod +x /wait
COPY . .
CMD /wait && npm start