#!/usr/bin/env bash

echo "$BASH_VERSION <- this has to be above 4.0"

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
  # X  require("colyseus.cjs")
  sed -E 's/require\("\.(.*)\.js"\)/require(".\1.cjs")/g' $f > "${f%.js}.cjs"
  rm $f
done

for f in $workspace/**/*.js.map; do
  # For .js.map files
  #    "file":"index.js"
  # -> "file":"index.cjs"
  sed -i '' -E 's/"file":"(.*)\.js"/"file":"\1.cjs"/g' $f
done
