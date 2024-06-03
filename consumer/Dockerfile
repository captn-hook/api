FROM node

WORKDIR /usr/src/app

COPY ./consumer/package*.json ./

RUN npm install --verbose

COPY . .

CMD [ "node", "./consumer/generator.js" ]