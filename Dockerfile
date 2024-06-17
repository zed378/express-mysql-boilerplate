FROM node:20-alpine
WORKDIR /app
RUN mkdir /app/log
RUN mkdir /uploads
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]