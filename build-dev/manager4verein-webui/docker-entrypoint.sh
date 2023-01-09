#!/bin/bash

timedatectl set-timezone $TIMEZONE

echo "root:$ROOT_PASSWORD" | chpasswd

sed -i "s/color:.*/color: $SERVER_COLOR/" /etc/ajenti/config.yml
sed -i "s/name:.*/name: $SERVER_NAME/" /etc/ajenti/config.yml
sed -i "s/  port:.*/  port: $SERVER_PORT/" /etc/ajenti/config.yml
sed -i "s/  provider:.*/  provider: m4v/" /etc/ajenti/config.yml
sed -i "s/  user_config:.*/  user_config: m4v/" /etc/ajenti/config.yml

cat << EOF >> /etc/ajenti/config.yml

view:
    plugin: m4v_common
    filepath: resources/content/main_view.html
EOF

mkdir -p /opt/app/config/

cat << EOF > /opt/app/config/config.json
{
    "mysql_host": "$MYSQL_HOST",
    "mysql_user": "$MYSQL_USER",
    "mysql_password": "$MYSQL_PASSWORD",
    "mysql_database": "$MYSQL_DATABASE"
}
EOF

echo "Waiting for mariadb to start (may take a while)..."
while [ "$(mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e "show tables;" 2>&1 | awk '{print $1}')" == "ERROR" ]; do
    sleep 1
    echo "."
done
echo "finished!"

if [ $(mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e "show tables;" | wc -l) -le 3 ]; then
    echo "This seems to be the first start. Create sql database and structure first!"
    mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < /root/m4v-sqltemplate.sql
    mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e "INSERT INTO m4v_users (username, firstname, lastname, mail, password) VALUES ('admin', 'Adam', 'Administrator', 'admin@example.com', '670506c9b67375007e1b50d698085e54bcd6e8bc6a7fece2a907ff42b83a92698147460dee66c1856ac9777875c7f0e5b1edac57486e7a841311ea6beeb235a2')"
fi

if [ $DEV_MODE == 1 ]
then
    echo "Starting in development-mode...!"
    echo "===> Run 'docker exec -it -w /opt/app/plugins manager4verein_webui_dev ajenti-dev-multitool --run-dev'"
    tail -f /var/log/faillog
else
    ajenti-panel -d --stock-plugins --plugins /opt/app/plugins -v
    echo "Waiting for ajenti to start..."
    while [ ! -f /var/log/ajenti/ajenti.log ]; do
        sleep 1
        echo "."
    done
    echo "finished!"
    tail -f /var/log/ajenti/ajenti.log
fi
