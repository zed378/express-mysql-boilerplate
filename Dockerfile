FROM node:20-alpine
WORKDIR /app
RUN mkdir /app/log
RUN mkdir /app/uploads
RUN mkdir /app/uploads/profile
RUN mkdir /app/uploads/invoice
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]