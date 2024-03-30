FROM ubuntu:latest

RUN apt-get update

RUN apt-get install dpkg -y

RUN apt-get install wget -y

RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-arm64-100.9.4.deb

RUN apt install ./mongodb-database-tools-*-100.9.4.deb