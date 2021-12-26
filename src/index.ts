const { Client, Intents } = require('discord.js');
const wok = require('wokcommands');
const path = require('path');
require('dotenv').config();


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});


client.once('ready', async () => {
    new wok(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['886139397429407744']
    });
})

client.login(process.env.token)