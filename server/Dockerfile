FROM docker.artifactory.adform.com/aap/node:8

WORKDIR /usr/src/app

COPY . .

RUN npm i yarn nodemon babel-cli -g

RUN npm i 

EXPOSE 4000

ENTRYPOINT ["nodemon", "-L", "./src/index.js"]

