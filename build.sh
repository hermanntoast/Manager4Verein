#!/bin/bash

TAG=$1
if [ -z "$TAG" ]; then echo "No tag given!" && exit; fi

cp -vr ./app ./build-dev/manager4verein-webui/app
docker build -t hermanntoast/manager4verein_webui:$TAG ./build-dev/manager4verein-webui
docker push hermanntoast/manager4verein_webui:$TAG
rm -r ./build-dev/manager4verein-webui/app