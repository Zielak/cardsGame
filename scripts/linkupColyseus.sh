# Meant to be run from project root npm script

cd ./example
npm link colyseus
npm link @colyseus/schema

cd ../packages/client
npm link colyseus.js
npm link @colyseus/schema

cd ../server
npm link colyseus
npm link @colyseus/schema

cd ../utils
npm link @colyseus/schema
