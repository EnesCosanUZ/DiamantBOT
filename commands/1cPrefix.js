const Discord = require('discord.js')
const db = require(`quick.db`)
const moment = require(`moment`)
const colours = require(`../colours.json`)

module.exports.run = async (client, message, args) => {
    var pMessage = message.content.split(` `).slice(1)
    var oldPrefix = `d!` || db.fetch(`${message.guild.id}_${prefix}`)
    var newPrefix = pMessage[0]
    let cEmbed = new Discord.MessageEmbed()
    .setColor(colours.orange)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());
    
    if(!message.member.hasPermission("ADMINISTRATOR")){
        cEmbed.setDescription(`❌ You do not have permissions to administrator. Please contact a staff member`)
        return message.channel.send({embed: cEmbed})
    } else if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
        bEmbed.setDescription("❌ I do not have permissions to administrator. Please contact a staff member")
        return message.channel.send({embed: cEmbed})
    } else if(!newPrefix) {
        cEmbed.setDescription(`My prefix is ${oldPrefix}. You can change *d!prefix <new prefix>*`)
        return message.channel.send({embed: cEmbed})
    } else if(newPrefix){
        db.set(`${message.guild.id}_prefix`, newPrefix)
        cEmbed.setDescription(`My prefix is changed as ${newPrefix}`)
        return message.channel.send({embed: cEmbed})
    }
};

module.exports.config =  {
    name: `prefix`,
    description: `Using for change prefix!`,
    usage: `prefix (New Prefix)`,
    accessableby: `Owners`,
    aliases: [`p`]
};