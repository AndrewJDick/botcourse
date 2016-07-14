const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const token = process.env.SLACK_TOKEN || '';
const isPhone = require('is-phone');
const Wit = require('wit-js');

const rtm = new RtmClient(token, {
  logLevel: 'error',
  // logLevel: 'debug',
  // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
  dataStore: new MemoryDataStore(),
  // Boolean indicating whether Slack should automatically reconnect after an error response
  autoReconnect: true,
  // Boolean indicating whether each message should be marked as read or not after it is processed
  autoMark: true,
});


const WitClient = new Wit.Client({
  apiToken: '4BPM4Z5KW42AHDFOTSOGIRK4VSLRXHD3'
});

/* proxy for now, for flexibility in this area later */
const setState = (newState) => {
  state = newState;
}

const states = {
  DEFAULT: "DEFAULT",
  GET_NAME: "GET_NAME",
  GET_ADDRESS: "GET_ADDRESS",
  GET_PHONE: "GET_PHONE",
  GET_GENDER: "GET_GENDER",
  GET_CONFIRMATION: "GET_CONFIRMATION"
}

/* init state, set initial state */
let state;
state = states.DEFAULT;

/* Store User Data. */
var userData = [];

/* functions that send responses and set state, called based on state */

const handlers = {};

handlers.DEFAULT = (message) => {
  
  rtm.sendMessage("Welcome! I hear you would like to go on holiday?", message.channel);
  WitClient.message(message.text, {})
    .then((response) => {
        console.log(response.entities);
    })
    .catch((err) => {
        console.error(err);
    });
}

// handlers.GET_NAME = (message) => {
  
//   console.log(message.text, state);
//   userData.push("Name: " + message.text + ';');
//   rtm.sendMessage("Ok, what's your address?", message.channel);
//   setState(states.GET_ADDRESS);
//   console.log(message.text, state);

// }

// handlers.GET_ADDRESS = (message) => {

//   console.log(message.text, state);
//   userData.push("Address: " + message.text + ';');
//   rtm.sendMessage("What's your phone number?", message.channel);
//   setState(states.GET_PHONE);
//   console.log(message.text, state);

// }

// handlers.GET_PHONE = (message) => {

//   console.log(message.text, state);

//   if (isPhone(message.text)) {
//   	userData.push("Phone Number: " + message.text + ';');
//     rtm.sendMessage("What's your gender?", message.channel)
//     setState(states.GET_GENDER);
//   } else {
//     rtm.sendMessage("Oops, that doesn't look like a valid phone number. Try again with this format: QQQ QQQ QQQQ", message.channel)  
//   }

//   console.log(message.text, state);

// }

// handlers.GET_GENDER = (message) => {
 
//   console.log(message.text, state);
//   userData.push("Gender: " + message.text + ';');
//   setState(states.GET_CONFIRMATION);
//   console.log(message.text, state);

// }

// handlers.GET_CONFIRMATION = (message) => {
  
//   console.log(message.text, state);
//   rtm.sendMessage("Thanks! Here is your data: ", message.channel)
//   for (var response in userData) {
//     rtm.sendMessage(userData[response], message.channel);
//   }
//   setState(states.DEFAULT);
//   console.log(message.text, state);
//   console.log(userData);

// }


const router = (message) => {
  handlers[state](message);
}

// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  router(message);
});

rtm.start();