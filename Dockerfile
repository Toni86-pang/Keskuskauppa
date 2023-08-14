FROM node:18-alpine AS builder

WORKDIR /frontend

COPY ./frontend/*.json ./
COPY ./frontend/index.html ./
COPY ./frontend/vite.config.ts ./
COPY ./frontend/src ./src

RUN npm ci
RUN npm run build

WORKDIR /backend

COPY ./backend/src ./
COPY ./backend/*.json ./

RUN npm ci
RUN npm run build

FROM node:18-alpine AS final

WORKDIR /app

ARG PORT
ARG PG_HOST
ARG PG_PORT
ARG PG_USERNAME
ARG PG_PASSWORD
ARG PG_DATABASE
ARG PG_SSL=false

ENV PORT=${PORT}
ENV PG_HOST=${PG_HOST}
ENV PG_PORT=${PG_PORT}
ENV PG_USERNAME=${PG_USERNAME}
ENV PG_PASSWORD=${PG_PASSWORD}
ENV PG_DATABASE=${PG_DATABASE}
ENV PG_SSL=${PG_SSL}

COPY --from=builder ./backend/package*.json ./
COPY --from=builder ./backend/dist ./dist
COPY --from=builder ./frontend/dist ./dist/client
RUN ls ./dist
RUN npm ci --omit=dev

EXPOSE ${PORT}
CMD ["npm", "start"]
