# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .npmrc  ./
RUN yarn --ignore-scripts
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build/client/ /usr/share/nginx/html/
COPY landing-page/ /usr/share/nginx/html/landing/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 