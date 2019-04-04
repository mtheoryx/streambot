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
client.on('disconnected', onDisconnectedHandler);

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
  const commandName = msg.trim().split(' ');

  // console.log(JSON.stringify(context, 0, 4));
  const rollResult = roll(20);
  let spice = '';
  // Switch on a known command
  if (commandName[0] === '!dice') {
    switch (rollResult) {
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
      `@${context.username} You rolled for initiative: ${rollResult}${spice}`
    );
  } else if (commandName[0] === '!c') {
    // this is an ability/perception check
    // Example perception check: !c perception 6
    // This is type: perception, dice sides 6, roll, and say command
    const type = commandName[1] || 'intelligence';
    const sides = commandName[2] || 4;
    check(target, context, type, sides);
  }
}
// Define onConnectHandler
function onConnectedHandler(addr, port) {
  client.say(`${opts.channels[0]}`, `Bot entering chat...`);
}

// TODO: Would be nice to have the bot leave a message
// when killing the bot server
// process.on('SIGINT', onDisconnectedHandler);

// Define onDisconnectedHandler
function onDisconnectedHandler(_) {
  client.say('Bot leaving chat.');
}

function check(target, context, type, sides) {
  client.say(
    target,
    `${context.username} made a ${rollType(type)} check, got a: ${roll(sides)}!`
  );
}

// Type of role
function rollType(type = 'initiative') {
  // initiative, strength, dexterity, constitution, intelligence, wisom, charisma
  // Messages map or switch
  return `heccin ${type} `;
}

// Number of sides to the dice
function roll(sides = 20) {
  return Math.floor(Math.random() * sides) + 1;
}
