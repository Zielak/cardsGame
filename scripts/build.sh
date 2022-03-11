#!/bin/bash

SCOPE=$1
PARAM=$2

WATCH=""
if [[ $PARAM == "-w" ]]; then
  WATCH=":watch";
fi

if [[ -z "$SCOPE" ]]; then
  lerna run --stream build$WATCH;
else
  lerna run --stream --scope @cardsgame/$SCOPE build$WATCH;
fi
