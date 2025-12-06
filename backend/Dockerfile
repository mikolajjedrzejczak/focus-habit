FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm install

ENV DATABASE_URL="postgresql://dummy:password@localhost:5432/db"

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]