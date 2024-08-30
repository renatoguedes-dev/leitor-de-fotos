FROM node:22-alpine3.19

RUN mkdir -p /home/node/projeto-shopper/node_modules

WORKDIR /home/node/projeto-shopper

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]