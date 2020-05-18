const Discord = require("discord.js")
const colours = require("../colours.json")
let moment = require(`moment`)

module.exports.run = async (client, message, args) => {
    var bUser = args[0]
    var bGuild = message.guild.name
    let bEmbed = new Discord.MessageEmbed()
    .setColor(colours.darkred)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        bEmbed.setDescription("❌ You do not have permissions to ban members. Please contact a staff member")
        return message.channel.send({embed: bEmbed})
    } 
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        bEmbed.setDescription("❌ I do not have permissions to ban members. Please contact a staff member")
        return message.channel.send({embed: bEmbed})
    } 
    if(!bUser){
        bEmbed.setDescription(`*Please write a user id!*`)
        return message.channel.send({embed: bEmbed})
    } else if (bUser) {
        message.guild.members.unban(bUser)
        bEmbed.setDescription(`<@${bUser}>'s ban is removed!`)
        return message.channel.send({embed: bEmbed})

    }
}

module.exports.config = {
    name: `unban`,
    description: `Using for user's ban remove!`,
    usage: `unban (@mention)`,
    accessableby: `Owners`,
    aliases: []
}