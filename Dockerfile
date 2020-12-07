FROM node:15.3-alpine

WORKDIR /pl-server
ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
RUN yarn install

ADD . /pl-server
RUN yarn build

CMD  ["yarn", "start"]
