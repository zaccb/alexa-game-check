#/bin/sh

NOW=$(date +"%Y%m%d-%H%M")

cd ~/source/alexa-game-check/src

zip -r ~/source/alexa-game-check/dist/archive$NOW.zip index.js AlexaSkill.js cities.js node_modules
