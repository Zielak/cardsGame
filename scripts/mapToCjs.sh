#!/usr/bin/env bash

if [[ "${BASH_VERSION:0:1}" -lt 4 ]];
then
  echo "$BASH_VERSION <- this has to be above 4.0"
  exit
fi

shopt -s globstar

if [[ -z $1 ]];
then 
  workspace="."
else
  workspace="$1"
fi

for f in $workspace/**/*.js; do
  #    require("./index.js")
  # -> require("./index.cjs")
  # only local files
  # X  require("colyseus.cjs")
  sed -E "s/require\(\"\.(.*)\.js\"\)/require(\".\1.cjs\")/g" $f > "${f%.js}.cjs"
  rm $f
done

for f in $workspace/**/*.js.map; do
  # For .js.map files
  #    "file":"index.js"
  # -> "file":"index.cjs"
  if [[ $OSTYPE == 'darwin'* ]]; then
    sed -i "" -E "s/\"file\":\"(.*)\.js\"/\"file\":\"\1.cjs\"/g" $f
  else
    sed -i -E "s/\"file\":\"(.*)\.js\"/\"file\":\"\1.cjs\"/g" $f
  fi
done
