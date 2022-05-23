FROM ubuntu:focal
LABEL Maintainer "Lukas Spitznagel <dev@hermann-toast.de>"

ENV TZ=Europe/Berlin

RUN apt-get update

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    apt-get install -y software-properties-common curl sudo nano wget unzip

RUN add-apt-repository universe && \
    apt-get install -y build-essential python3-pip python3-dev python3-lxml libssl-dev python3-dbus python3-augeas python3-apt ntpdate

RUN pip3 install setuptools pip wheel -U && \
    pip3 install ajenti-panel ajenti.plugin.augeas ajenti.plugin.core

RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    npm -g install bower babel-cli babel-preset-es2015 babel-plugin-external-helpers less coffee-script angular-gettext-cli angular-gettext-tools && \
    apt-get install -y gettext && \
    pip3 install ajenti-dev-multitool

RUN pip3 install python-pam mysql-connector-python 

COPY ../../app/ /opt/app/

COPY docker-entrypoint.sh /root/docker-entrypoint.sh
RUN chmod +x /root/docker-entrypoint.sh

ENTRYPOINT [ "/root/docker-entrypoint.sh" ]
