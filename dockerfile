FROM node:22-alpine3.19

RUN mkdir -p /projeto-shopper/node_modules && chown -R node:node /projeto-shopper

WORKDIR /projeto-shopper

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "index.js"]