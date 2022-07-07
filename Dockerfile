FROM node:fermium-alpine

RUN apk add git

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
VOLUME /opt/app/contracts

CMD [ "sh", "-c", "yarn clean && yarn codegen && yarn build --network bsc --network-file ./contracts/networks.json && yarn create:env && yarn deploy:env" ]
