FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

COPY scraper-basados/package*.json ./

RUN npm ci

COPY scraper-basados/ .

RUN npx playwright install chromium --with-deps

EXPOSE 3001

CMD ["node", "server.js"]