FROM node:16-alpine

# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY . .

RUN npm install

CMD ["npm","run","dev"]
