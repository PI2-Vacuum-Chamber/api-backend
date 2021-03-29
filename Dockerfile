FROM node:10

RUN mkdir -p /usr/src
WORKDIR /usr/app

COPY . .

RUN yarn

EXPOSE 8001