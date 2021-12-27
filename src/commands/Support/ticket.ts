import {ICommand} from "wokcommands";
import {MessageEmbed} from "discord.js";
const discordTranscripts = require("discord-html-transcripts");

let questions = [
    "**What is the reason for this case?**",
    "**What will you help with**",
    "**How much time will you be able to give us**",
    "**Which programming languages do you know**",
    "**Which languages do you know**",
    "**How old are you**"
]


export default {
    category: "Support",
    description: "Creates a ticket",
    slash: false,
    testOnly: true,
    guildOnly: true,
    callback: async ({message, args}) => {
        let questionCounter = 0;
        let endCounter = 0;

        await message.guild?.channels.create(`Ticket-${message.author.tag}`, {
            reason: "Support requested",
            type: 'GUILD_TEXT',
            nsfw: false,
            parent: '923338193879830558',
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'ADD_REACTIONS']
                },
                {
                    id: message.guild?.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                    }
            ]
        }).then(async channel => {
            await channel.send(questions[questionCounter++])

            const filter = (m: any) => {
                return m.author.id === message.author.id;
            }

            const collector = channel.createMessageCollector({
                filter,
                time: 36000 * 1000
            })

            collector.on('collect', async m => {
                if(m.author.bot) return;
                if(questionCounter < questions.length) {
                    await channel.send(questions[questionCounter++])
                } else {
                    collector.stop('done')
                }
            })

            collector.on('end', (collected, reason) => {
                if(reason === 'done') {
                    let index = 1;
                    let quest = collected.map((msg) => `${index++}) ${questions[endCounter++]} » \`${msg.content}\``).join("\n");
                    let embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`**Reason**: ${String(questions[0])}\n\n${quest}`)
                        .setColor('BLURPLE')
                    channel.send({ embeds: [embed] }).then(m => {
                        m.react('🔒');
                        const rcollect = m.createReactionCollector({
                            time: 3600 * 1000
                        });

                        rcollect.on('collect', (reaction, user) => {
                            if(reaction.emoji.name === '🔒') {
                                if(user.bot) return;
                                const channel = message.channel;
                                const attachment = discordTranscripts.createTranscript(channel);
                                user.send({
                                    files: [attachment]
                                });
                            }
                        })

                    })
                }
            })
        });
    }
} as ICommand
