/***
################################################################
    Game Check skill for Alexa written by Zach Baker.
    Forked from Amazon build docs @ https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/minecraftHelper/src/index.js

################################################################

    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

################################################################
*/

'use strict';

var AlexaSkill = require('./AlexaSkill');
var cities = require('./cities');

var APP_ID = 'amzn1.ask.skill.77bd2d1c-f055-4297-a899-84a17a7dd9af'; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Inherit AlexaSkill
 */
var GameCheck = function () {
    AlexaSkill.call(this, APP_ID);
};

/**
 * Extend AlexaSkill
 */
GameCheck.prototype = Object.create(AlexaSkill.prototype);
GameCheck.prototype.constructor = GameCheck;

GameCheck.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Game Check Helper. You can ask me if there's a game today in your city and I'll check it out and let you know.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Ask me if there is an game today in your city.";
    response.ask(speechText, repromptText);
};

/**
 * Intent Handling
 */
GameCheck.prototype.intentHandlers = {
    "GetEventIntent": function (intent, session, response) {      
        console.log("Intent OBJ: " + intent);

        var itemSlot = intent.slots.City,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        console.log(itemName);

        if(cities.indexOf(itemName) !== -1){
          var speech = checkGameByCity(itemName);

          if(speech !== null){
            respondSuccess(response, speech);
          } else {
            console.log("checkGameByCity() call failed;");
            speech = "I don't know about games in " + itemName + " yet.";
            respondFail(response, speech);
          }
        } else {
          console.log("slot value not in LIST_OF_CITIES");
          console.log(itemName);
          speech = "I don't know about games in " + itemName + " yet. Sorry.";
          respondFail(response, speech);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask me if there's a game today in your city and I'll check it out and let you know.";
        var repromptText = "Ask me if there is an game today in your city.";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var gameCheck = new GameCheck();
    gameCheck.execute(event, context);
};

function checkGameByCity(city){
  if(city === "seattle"){
    return "yes";
  }
  return "no";
}

function respondSuccess(response, msg){
  var speechOutput = {
      speech: msg,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };

  response.tell(speechOutput);
}

function respondFail(response, msg){
  var speechOutput = {
      speech: msg,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  var repromptOutput = {
      speech: "What else can I help with?",
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.ask(speechOutput, repromptOutput);
}
