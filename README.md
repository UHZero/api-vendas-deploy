docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d redislabs/redisinsight:latest
5432:5432 -d postgres

docker run --name redis -p 6379:6379 -d -t redis:alpine

docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d redislabs/redisinsight:latest

docker exec -it redis sh

redis-cli
set/get/del

rodar container e criar o banco apivendas (ultilizei o dbeaver)

deploy repository
