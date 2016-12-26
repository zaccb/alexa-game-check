#/bin/sh

NOW=$(date +"%Y%m%d-%H%M")

cd ~/source/alexa-game-check/src

zip -r archive$NOW.zip index.js AlexaSkill.js cities.js node_modules
