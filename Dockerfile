FROM node:22.19.0-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd

COPY package.json package-lock.json ./

RUN npm install

RUN npm i -g serve

COPY . .

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]

EXPOSE 5173

CMD [ "serve", "-s", "-l", "5173", "dist" ]