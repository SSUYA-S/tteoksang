FROM ubuntu:jammy

RUN apt-get update

RUN apt-get install dpkg -y

RUN apt-get install wget -y

ADD install.sh /

RUN sh install.sh