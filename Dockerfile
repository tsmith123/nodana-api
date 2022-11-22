FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY .env .
COPY src src

RUN yarn
RUN yarn build

CMD ["node","dist/index.js"]
