FROM ubuntu:jammy

RUN apt-get update

RUN apt-get install dpkg -y

RUN apt-get install wget -y

RUN if [ "$(uname -m)" = "amd64"] || [ "$(uname -m)" = "x86_64"]; then \
        wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb -O mongodb-database-tools.deb; \
    elif [ "$(uname -m)" = "arm64" ] || [ "$(uname -m)" = "aarch64"]; then \
        wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-arm64-100.9.4.deb -O mongodb-database-tools.deb; \
    fi

RUN if [ -f ./mongodb-database-tools.deb ]; then \
        apt-get install ./mongodb-database-tools.deb; \
    else \
        echo "not found"; \
    fi
