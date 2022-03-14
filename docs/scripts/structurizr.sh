#!/bin/bash

PWD=$(pwd)

docker run -it --rm -p 8080:8080 -v $PWD/architecture:/usr/local/structurizr structurizr/lite
