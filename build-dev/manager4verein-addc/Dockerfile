FROM ubuntu:22.04
 
RUN DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install samba krb5-config winbind smbclient 
RUN DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install iproute2
RUN DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install openssl
RUN DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install nano
 
RUN rm /etc/krb5.conf
RUN mkdir -p /opt/ad-scripts

COPY samba-ad-setup.sh /opt/ad-scripts/samba-ad-setup.sh
COPY samba-ad-run.sh /opt/ad-scripts/samba-ad-run.sh
 
WORKDIR /opt/ad-scripts
 
CMD chmod +x *.sh && ./samba-ad-setup.sh && ./samba-ad-run.sh
