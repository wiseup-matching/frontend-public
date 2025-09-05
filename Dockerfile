FROM node:22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173                   
CMD ["npm","start"]