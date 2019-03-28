const tmi = require('tmi.js');
// const token = require('./auth');
require('dotenv').config();

// Remove token ref, use real env token
// Remove username string, use real env token
// Remove human user, instead use the agent user

const opts = {
  identity: {
    username: `${process.env.USER}`,
    password: `${process.env.TOKEN}`
  },
  channels: ['roberttables']
};

// Create a client
const client = new tmi.client(opts);

// Register the event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to The Twitches
client.connect();

// Define onMessageHandler
function onMessageHandler(target, context, msg, self) {
  // console.log(target);
  if (self) {
    // Ignore messages form the bot itself
    return;
  }
  // Remove the whitespace (ex: !dice<space> !dice)
  const commandName = msg.trim();

  // console.log(JSON.stringify(context, 0, 4));
  const roll = roll20();
  let spice = '';
  // Switch on a known command
  if (commandName === '!dice') {
    switch (roll) {
      case 20:
        spice = ` - NAT 20 robert68Hecc`;
        break;
      case 1:
        spice = ` - NAT 1, you lose the blanket robert68Hecc`;
        break;
      default:
        break;
    }
    client.say(
      target,
      `@${context.username} You rolled for initiative: ${roll}${spice}`
    );
  }
  const commandMap = {
    '!dice': roll20,
    '!coin': flipCoin
  };

  commandMap[commandName]();
}
// Define onConnectHandler
function onConnectedHandler(addr, port) {
  client.say(
    `${opts.channels[0]}`,
    `robert68Hecc Bot in the chat ready to roll! robert68Shipit`
  );
}

// Callback for function
function roll20() {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Flip Coin
function flipCoin() {
  return Math.floor(Math.random() * 2) + 1;
}
