// Known device ID: 438
const tmi = require('tmi.js');
const Particle = require('particle-api-js');
require('dotenv').config();

const TWITCH_USER = process.env.USER;
const TWITCH_TOKEN = process.env.TOKEN;
const DEVICE_TOKEN = process.env.PARTICLE_TOKEN;
const DEVICE_ID = process.env.DEVICE_ID;

const colors = {
  blue: 'Ox0000FF',
  purple: '0x663399',
  green: '0x008000',
  orangered: '0xFF4500',
  cyan: '0x00FFFF'
};

const opts = {
  identity: {
    username: `${TWITCH_USER}`,
    password: `${TWITCH_TOKEN}`
  },
  channels: ['roberttables']
};

const client = new tmi.client(opts);
const particle = new Particle();

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

const commands = {
  '!ledOn': async (target, context, msg) => {
    client.say(target, `${context.username} wants the light on!`);
    // Message is a string, split and match with color map
    const color = msg.split(' ')[1];

    if (colors[color]) {
      // Call the particle color function
      await particle.callFunction({
        deviceId: DEVICE_ID,
        name: 'setColor',
        argument: colors[color], //TODO pass color
        auth: DEVICE_TOKEN
      });
    } else {
      // Call the particle color fucntion with rebbecca purple
      await particle.callFunction({
        deviceId: DEVICE_ID,
        name: 'setColor',
        argument: '0x669900', // default to rebbecca purple
        auth: DEVICE_TOKEN
      });
    }

    return await particle.callFunction({
      deviceId: DEVICE_ID,
      name: 'led',
      argument: 'on',
      auth: DEVICE_TOKEN
    });
  },
  '!ledOff': async (target, context) => {
    client.say(target, `${context.username} wants the light off!`);
    // Don't care, color will be black, let the device handle that
    return await particle.callFunction({
      deviceId: DEVICE_ID,
      name: 'led',
      argument: 'off',
      auth: DEVICE_TOKEN
    });
  }
};

function onMessageHandler(target, context, msg, self) {
  if (self) {
    // Ignore messages form the bot itself
    return;
  }
  const commandName = msg.trim().split(' ')[0];

  if (commandName.startsWith('!') && commands[commandName]) {
    return commands[commandName](target, context, msg);
  }
}

function onConnectedHandler(addr, port) {
  console.log(`Bot connected at ${addr}:${port}...`);
}
