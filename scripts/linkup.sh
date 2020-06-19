# Meant to be run from project root npm script

cd ./packages/client
npm link
cd ../server
npm link
cd ../types
npm link
cd ../utils
npm link

echo Going to example directory!

cd ../../example
npm link @cardsgame/server
npm link @cardsgame/client
npm link @cardsgame/utils
npm link @cardsgame/types
