const Discord = require("discord.js")
const colours = require("../colours.json")
let moment = require(`moment`)

module.exports.run = async (client, message, args) => {
    var bMessage = message.content.split(` `).slice(1)
    var bUser = message.mentions.members.first()
    var bReason = bMessage[1]
    var bGuild = message.guild.name
    let bEmbed = new Discord.MessageEmbed()
    .setColor(colours.darkred)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        bEmbed.setDescription("❌ You do not have permissions to kick members. Please contact a staff member")
        return message.channel.send({embed: bEmbed})
    } 
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
        bEmbed.setDescription("❌ I do not have permissions to kick members. Please contact a staff member")
        return message.channel.send({embed: bEmbed})
    } 
    if(!bUser){
        bEmbed.setDescription(`*Please mention a user or write user id!*`)
        return message.channel.send({embed: bEmbed})
    } else if (!bReason) {
        bEmbed.setDescription(`*Please write a reason!*`)
        return message.channel.send({embed: bEmbed})
    } else if (bUser && bReason) {
        bEmbed.setDescription(`*${bUser} was kicked for ${bReason} by ${message.author}!*`)
        bUser.send(`**You are kicked from** *${bGuild}* **for** *${bReason}* **by** *<@${message.author.id}>*!`)
        bUser.kick({reason: `${bReason}`})
        return message.channel.send({embed: bEmbed})

    }
}

module.exports.config = {
    name: `kick`,
    description: `Using for kick a user!`,
    usage: `kick (@mention)`,
    accessableby: `Owners`,
    aliases: []
}