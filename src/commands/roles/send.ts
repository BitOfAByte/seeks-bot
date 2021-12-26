import {ICommand} from "wokcommands";
import {TextChannel} from "discord.js";

export  default {
    category: 'Roles',
    description: 'balbal',
    testOnly: true,
    guildOnly: true,
    slash: false,
    minArgs: 2,
    expectedArgs: "<channel>, <text>",
    expectedArgsTypes: ['CHANNEL', 'STRING'],
    callback: ({ message, args, client}) => {
        const channel = client.channels.cache.get('924672926991679538') as TextChannel;

        args.shift()
        const text = args.join(' ')
        channel.send(text)
    }
} as ICommand