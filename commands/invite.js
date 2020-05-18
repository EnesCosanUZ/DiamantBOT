const Discord = require(`discord.js`)
const db = require(`quick.db`)
const moment = require(`moment`)
const colours = require(`../colours.json`)

module.exports.run = async (client, message, args) => {  
    var iUser = message.mentions.users.first() || message.author  
    var iUserAmount = db.get(`${message.guild.id}_${iUser.id}_inviteAmount`) || "0"
    
    let iEmbed = new Discord.MessageEmbed()
    .setColor(colours.gold)
    .setAuthor(`${iUser.username}'s Invite Info`, iUser.displayAvatarURL({dynamic:"1"}))
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL())
    .setDescription(`<@${iUser.id}> invited ${iUserAmount} until now.`)
    message.channel.send({embed: iEmbed})
}

module.exports.config = {
    name: `invite`,
    description: `Creates link for invite!`,
    usage: `invite`,
    accessableby: [`Owners`, `Members`],
    aliases: []
}