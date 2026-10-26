# The LIVE storefront as one container (Railway, Fly, Render, any Docker host).
# Build args are not needed: the site reads AAMER_API_URL, STOREFRONT_SLUG and SITE_ORIGIN at run time.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3100
ENV PORT=3100
CMD ["node", "server.js"]
