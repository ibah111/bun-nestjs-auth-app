FROM oven/bun:alpine AS base
WORKDIR /usr/src/app
COPY package.json bun.lock ./

FROM base AS dev_deps
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=dev_deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS release
RUN apk add --no-cache nodejs
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/migrations ./migrations
COPY --from=build /usr/src/app/scripts ./scripts
EXPOSE 30111
CMD ["bun", "run", "start:container"]
