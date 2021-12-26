import {ICommand} from "wokcommands";
import {
    Client, GuildMember,
    MessageActionRow,
    MessageSelectMenu,
    MessageSelectOptionData,
    Role,
    TextChannel
} from "discord.js";

export default {
    category: "roles",
    description: "Adds a role to the auto role message",
    permissions: ['ADMINISTRATOR'],
    minArgs: 3,
    maxArgs: 3,
    expectedArgs: "<channel> <messageid> <role>",
    expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE'],
    slash: 'both',
    testOnly: true,
    guildOnly: true,
    init: (client: Client) => {
        client.on('interactionCreate', interaction => {
            if(!interaction.isSelectMenu()) {
                return
            }
            const {customId, values, member} = interaction


            const compon = interaction.component as MessageSelectMenu
            const removed = compon.options.filter((option) => {
                return !values.includes(option.value)
            })

            if(customId === 'auto_roles' && member instanceof GuildMember) {
                for(const id of values) {
                    member.roles.add(id)

                }
                for(const id of removed) {
                    member.roles.remove(id.value);
                }

                interaction.reply({
                    ephemeral: true,
                    content: "Roles updated!"
                })
            }

        })
    },
    callback: async ({ message, args, interaction, client}) => {
        const channel = (message ? message.mentions.channels.first() : interaction.options.getChannel('channel')) as TextChannel
        if(!channel || channel.type !== 'GUILD_TEXT')
            return "Mention a channel"

        const messageId = args[1];
        const role = (message ? message.mentions.roles.first() : interaction.options.getRole('role')) as Role

        if(!role)
            return "Unknow role"

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true
        })

        if(!targetMessage)
            return "Unknow message id"

        if(targetMessage.author.id !== client.user?.id) {
            return `Please provide a message ID that was sent from <@${client.user?.id}>`
        }

        let row = targetMessage.components[0] as MessageActionRow
        if(!row) {
            row = new MessageActionRow()
        }

        const option: MessageSelectOptionData[] = [{
            label: role.name,
            value: role.id
        }]

        let menu = row.components[0] as MessageSelectMenu
        if(menu) {
            for(const o of menu.options) {
                if(o.value === option[0].value) {
                    return {
                        custom: true,
                        content: `<@&${o.value}> is already part of this menu`,
                        allowedMentions: {
                            roles: []
                        },
                        ephemeral: true
                    }
                }
            }

            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                    .setCustomId('auto_roles')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .setPlaceholder('Select your roles....')
                    .addOptions(option)
            )
        }

        await targetMessage.edit({
            components: [row]
        })

        return {
            custom: true,
            content: `Added <@&${role.id}> to the meun`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        }
    }
} as ICommand