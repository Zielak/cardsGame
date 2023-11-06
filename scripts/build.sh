#!/bin/bash

SCOPE=$1
PARAM=$2

WATCH=""
if [[ $PARAM == "-w" ]]; then
  WATCH=":watch";
fi

if [[ -z "$SCOPE" ]]; then
  turbo run build$WATCH;
else
  turbo run --filter="*$SCOPE*" build$WATCH;
fi
