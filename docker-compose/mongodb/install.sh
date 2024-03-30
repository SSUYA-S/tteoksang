arch=$(uname -m)

if [ "$arch" = "x86_64" ]; then
  wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.9.4.deb -O mongodb-database-tools.deb
else
  wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-arm64-100.9.4.deb -O mongodb-database-tools.deb
fi

if [ -f ./mongodb-database-tools.deb ]; then
    apt-get install ./mongodb-database-tools.deb
else
    echo "not found"
fi