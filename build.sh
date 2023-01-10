#!/bin/bash

TAG=$1
if [ -z "$TAG" ]; then echo "No tag given!" && exit; fi

BUILD=$(cat ./build.txt)
BUILD=$((BUILD + 1))
echo "Building Version $TAG / Build $BUILD..."
echo $BUILD > ./build.txt

cp -vr ./app ./build-dev/manager4verein-webui/app
cp -vr ./build.txt ./build-dev/manager4verein-webui/build.txt
docker build -t hermanntoast/manager4verein_webui:$TAG ./build-dev/manager4verein-webui
#docker push hermanntoast/manager4verein_webui:$TAG
rm -r ./build-dev/manager4verein-webui/app
rm -r ./build-dev/manager4verein-webui/build.txt