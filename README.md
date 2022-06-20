# Manager4Verein

```
version: "3.5"
services:
    manager4verein_webui:
        image: hermanntoast/manager4verein      
        container_name: manager4verein_webui
        ports:
            - "8000:8000"
        links:
            - manager4verein_db:mysql
        depends_on:
            - manager4verein_db
        environment:
            - ROOT_PASSWORD=Muster!
            - DEV_MODE=0
            - SERVER_NAME=manager.example.com
            - TIMEZONE=Europe/Berlin
            - SERVER_COLOR=blue
            - SERVER_PORT=8000
            - MYSQL_HOST=manager4verein_db
            - MYSQL_USER=root
            - MYSQL_PASSWORD=Muster!
            - MYSQL_DATABASE=manager4verein

    manager4verein_db:
        image: mariadb:latest
        container_name: manager4verein_db
        environment:
            - MYSQL_ROOT_PASSWORD=Muster!
            - MYSQL_DATABASE=manager4verein
        volumes:
            - ./db:/var/lib/mysql
```
