FROM node:22.11.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

COPY prisma/schema.prisma ./prisma/

RUN npx prisma db push

CMD ["npm", "start"]





