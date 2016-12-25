// 'use strict';
// // Import alexa-sdk library
// var Alexa = require('alexa-sdk');
// var http = require('http');
// var htmlParser = require('htmlparser2');
//
// var APP_ID = 'amzn1.ask.skill.00668e8f-cbce-4e98-ac44-6b12dd284e6b';
//
// var urlData = 'http://gametonight.in/seattle';
//
// // Verify that app_id in the request matches my app_id
// // Protects against another skill hitting the endpoint
// var GameCheck = function(){
//   Alexa.call(this, APP_ID);
// }
//
// GameCheck.prototype = Object.create(Alexa.prototype);
// GameCheck.prototype.constructor = GameCheck;
//
// GameCheck.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
//     var speechText = "Welcome to game checker. If you ask me if there is a game tonight in your city, I'll let you know.";
//     // If the user either does not reply to the welcome message or says something that is not
//     // understood, they will be prompted again with this text.
//     var repromptText = "For instructions on what you can say, please say help me.";
//     response.ask(speechText, repromptText);
// };
//
//
// exports.handler = function(event, context, callback){
//     var alexa = Alexa.handler(event, context);
//     alexa.APP_ID = APP_ID;
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };
//
// // Intent handler
// var handlers = {
//   'LaunchRequest': function () {
//     this.emit('GetEventIntent');
//   },
//
//   'GetEventIntent': function () {
//       http.get(urlData, function(response){
//        outputMsg = parseResponse(response);
//       })
//
//       this.emit(':tell', outputMsg);
//   }
// }
//
// var parseResponse = function(response) {
//   var data = "";
//   response.on('data', function(chunk) {
//     data += chunk;
//   });
//   var tags = [];
//   var tagsCount = {};
//   var tagsWithCount = [];
//   response.on('end', function(chunk) {
//     var parsedData = new htmlparser.Parser({
//      onopentag: function(name, attribs) {
//       if(tags.indexOf(name) === -1) {
//        tags.push(name);
//  tagsCount[name] = 1;
//        } else {
//  tagsCount[name]++;
//        }
//      },
//      onend: function() {
//       for(var i = 1;i < tags.length;i++) {
//        tagsWithCount.push({name:tags[i], count:tagsCount[tags[i]]});
//      }
//     }
//    }, {decodeEntities: true});
//    parsedData.write(data);
//    parsedData.end();
//    console.log(tagsWithCount);
//   });
// }

/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

var AlexaSkill = require('./AlexaSkill');
var cities = require('./cities');

var APP_ID = 'amzn1.ask.skill.00668e8f-cbce-4e98-ac44-6b12dd284e6b'; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Inherit AlexaSkill
 */
var GameCheck = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
GameCheck.prototype = Object.create(AlexaSkill.prototype);
GameCheck.prototype.constructor = GameCheck;

GameCheck.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Game Check Helper. You can ask me if there's a game today in your city and I'll check it out and let you know.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Ask me if there is an game today in your city.";
    response.ask(speechText, repromptText);
};

GameCheck.prototype.intentHandlers = {
    "GetEventIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var speechOutput,
            repromptOutput;

        if(cities.indexOf(itemName) !== -1){
          speechOutput = {
              speech: checkGameByCity(itemName),
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };

          response.tell(speechOutput);
        } else {
          var speech = "I'm not sure how to help you with that";

          speechOutput = {
              speech: speech,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          repromptOutput = {
              speech: "What else can I help with?",
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          response.ask(speechOutput, repromptOutput);
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
