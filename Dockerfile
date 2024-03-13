FROM node:14

WORKDIR '/api'
COPY * ./

RUN apt-get update && npm install

EXPOSE 3000

CMD ["node", "api.js"]