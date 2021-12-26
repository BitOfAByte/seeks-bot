import {ICommand} from "wokcommands";
const discordTranscripts = require('discord-html-transcripts');



export default {
    category: "Support",
    description: "Creates a ticket",
    slash: false,
    testOnly: true,
    guildOnly: true,
    callback: async ({message, args}) => {
        setTimeout(async  () => {
            const channel = message.channel; // or however you get your TextChannel

            const attachment = await discordTranscripts.createTranscript(channel);
            await message.author.send({
                files: [attachment]
            });
        }, 3000)
    }
} as ICommand
