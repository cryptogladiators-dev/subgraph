FROM node:fermium-alpine

ARG NETWORK=bsc
ENV NETWORK ${NETWORK}
ARG NETWORK_FILE="./contracts/networks.json"
ENV NETWORK_FILE ${NETWORK_FILE}

RUN apk add git

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
VOLUME /opt/app/contracts

CMD [ "sh", "-c", "yarn clean && yarn codegen && && yarn create:env && yarn deploy:env" ]
