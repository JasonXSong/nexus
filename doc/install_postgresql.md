# Install PostgreSQL

## Docker

### Pull Docker Image
```bash
docker pull docker.xuanyuan.me/postgres
```

### Get Docker Image ID
```bash
docker images
```
For example
```
REPOSITORY                    TAG       IMAGE ID       CREATED       SIZE
docker.xuanyuan.me/postgres   latest    445ed93b882f   5 weeks ago   438MB
```

### Run
```bash
docker run --name pg \
  -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 \
  -d 445ed9  
```
