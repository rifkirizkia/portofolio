FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tailwind.config.cjs robots.txt sitemap.xml ./
COPY scripts/ ./scripts/
COPY styles/ ./styles/
COPY js/ ./js/
COPY asset/ ./asset/
RUN npm run build && npm test

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
