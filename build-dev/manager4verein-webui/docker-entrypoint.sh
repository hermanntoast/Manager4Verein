#!/bin/bash

timedatectl set-timezone $TIMEZONE

echo "root:$ROOT_PASSWORD" | chpasswd

sed -i "s/color:.*/color: $SERVER_COLOR/" /etc/ajenti/config.yml
sed -i "s/name:.*/name: $SERVER_NAME/" /etc/ajenti/config.yml
sed -i "s/  port:.*/  port: $SERVER_PORT/" /etc/ajenti/config.yml
sed -i "s/  provider:.*/  provider: m4v/" /etc/ajenti/config.yml
sed -i "s/  user_config:.*/  user_config: m4v/" /etc/ajenti/config.yml

cat << EOF > /opt/app/config/config.json
{
    "mysql_host": "$MYSQL_HOST",
    "mysql_user": "$MYSQL_USER",
    "mysql_password": "$MYSQL_PASSWORD",
    "mysql_database": "$MYSQL_DATABASE"
}
EOF

if [ $(mysql -u root -p${ROOT_PASSWORD} ${MYSQL_DATABASE} -e "show tables;" | wc -l) -le 3 ]; then
    echo "This seems to be the first start. Create sql database and structure first!"
    mysql -u root -p${ROOT_PASSWORD} ${MYSQL_DATABASE} < /root/m4v-sqltemplate.sql
fi

if [ $DEV_MODE == 1 ]
then
    echo "Starting in development-mode...!"
    echo "===> Run 'docker exec -it -w /opt/app/plugins manager4verein_webui_dev ajenti-dev-multitool --run-dev'"
    tail -f /var/log/faillog
else
    ajenti-panel -d --stock-plugins --plugins /opt/app/plugins -v
    echo "Waiting for ajenti to start..."
    while [ ! -f /var/log/ajenti/ajenti.log ]
    do
        sleep 1
        echo "."
    done
    echo "finished!"
    tail -f /var/log/ajenti/ajenti.log
fi
