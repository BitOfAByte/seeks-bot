import {ICommand} from "wokcommands";
const discordTranscripts = require('discord-html-transcripts');

export default {
    category: "Support",
    description: "Creates a ticket",
    slash: false,
    testOnly: true,
    guildOnly: true,
    callback: async ({message, args}) => {
        const channel = message.channel;
        const attachment = await discordTranscripts.createTranscript(channel);
        await message.author.send({
            files: [attachment]
        });

        await channel.delete();
    }
} as ICommand
