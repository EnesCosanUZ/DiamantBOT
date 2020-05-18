const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(`You don't have manage channels permission. Please contact a staff member`)
    } else if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send(`I don't have manage channels permission. Please contact a staff member`)
    }
    var lChannel = message.mentions.channels.first()
    let lMember = message.author;
    let ever = message.guild.roles.everyone
    if(!lChannel) {
        message.channel.updateOverwrite(ever, {
            SEND_MESSAGES: false
          });
        message.channel.send(`${lMember} is locked this channel.`)
    } else if(lChannel) {
        lChannel.updateOverwrite(ever, {
            SEND_MESSAGES: false
          });
        lChannel.send(`${lMember} is locked this channel.`)
    }
};

module.exports.config = {
    name: `lock`,
    description: `Using for lock a channel!`,
    usage: `lock (#channel)`,
    accessableby: `Owners`,
    aliases: [`l`]
};