const Discord = require(`discord.js`)
const colours = require(`../colours.json`)
const fs = require(`fs`)
let moment = require(`moment`)
const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    let uinfo = message.author
    let hEmbed = new Discord.MessageEmbed()
    .setColor(colours.aqua)
    .setAuthor(`${uinfo.username}`, uinfo.displayAvatarURL())
    .setDescription(`**There is all commands!**`)
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());

    let commandsFiles = fs.readdirSync(`./commands/`).filter(f => f.split(`.`).pop() === `js`)
    let commandsConf = commandsFiles.forEach((f, i) => {
        let pull = require(`../commands/${f}`)
        let configName = pull.config.name;
        let configDesc = pull.config.description;
        let configUsage = pull.config.usage;
        let configAccess= pull.config.accessableby;
        if(message.member.hasPermission("MANAGE_CHANNELS") && configAccess.includes(`Owners`)){
            hEmbed.addFields({name: `**${configName}:** *${configDesc}*`, value: `${db.get(`${message.guild.id}_prefix`)}${configUsage}`})
        }
        if(!message.member.hasPermission("MANAGE_CHANNELS") && configAccess.includes(`Members`)){
            hEmbed.addFields({name: `**${configName}:** *${configDesc}*`, value: `${db.get(`${message.guild.id}_prefix`)}${configUsage}`})
        }
    })
    message.channel.send({embed: hEmbed})
}       
module.exports.config = {
    name: `help`,
    description: `List all commands for you!`,
    usage: `help`,
    accessableby: [`Members`, `Owners`],
    aliases: []
}