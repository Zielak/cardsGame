# Meant to be run from project root npm script

cd ./packages/client
npm link
cd ../server
npm link
cd ../types
npm link
cd ../utils
npm link

cd ../examples
npm link @cardsgame/server
npm link @cardsgame/client
