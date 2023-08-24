FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
RUN npm start
RUN npm test

COPY . .

CMD ["npm", "start"]