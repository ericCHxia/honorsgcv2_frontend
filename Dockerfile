FROM node:16.17.0-bullseye as builder
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npmmirror.com && yarn install && yarn build

FROM node:16.17.0-alpine as base
WORKDIR /app
COPY ./package.json /app/
COPY ./yarn.lock /app/
COPY ./nuxt.config.js /app/
COPY ./static /app/static
RUN npm config set registry https://registry.npmmirror.com && yarn install --production
COPY --from=builder /app/.nuxt /app/.nuxt
CMD yarn start