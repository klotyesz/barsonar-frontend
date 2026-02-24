FROM node:22.19.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm i -g serve

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_PROXY_TARGET
ARG VITE_WORKER_URL

RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} VITE_PROXY_TARGET=${VITE_PROXY_TARGET} VITE_WORKER_URL=${VITE_WORKER_URL} npm run build

EXPOSE 5173

CMD [ "serve", "-s", "-l", "5173", "dist" ]