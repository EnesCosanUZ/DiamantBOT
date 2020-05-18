const Discord = require(`discord.js`)
const moment = require(`moment`)
const colours = require(`../colours.json`);


module.exports.run = async (client, message, args) => {
    var server = message.guild
    var sicon = message.guild.iconURL({dynamic:"1"}) || "https://cdn.discordapp.com/embed/avatars/1.png"
    let cdate = moment.utc(server.createdAt).format(`DD MMM YYYY ddd HH:mm`)
    let sEmbed = new Discord.MessageEmbed()
    .setColor(colours.cyan)
    .setAuthor(`${message.guild.name} Info`, sicon)
    .setThumbnail(sicon)
    .addFields(
        { name: `**▬▬▬▬▬▬ STATS ▬▬▬▬▬▬**`, value: [
            `**Guild Name:** *${server.name}*`,
            `**Guild Owner:** *${server.owner}*`,
            `**Created At:** *${cdate}*`,
            `**Boost Level:** *${server.premiumTier}*`,
            `**Boost Count:** *${server.premiumSubscriptionCount}*`,
            `**Member Count:** *${server.memberCount} members*`
        ]
    })
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());
    message.channel.send({embed: sEmbed});
}


module.exports.config = {
    name: `serverinfo`,
    description: `Pulls the server info of server!`,
    usage: `serverinfo`,
    accessableby: [`Members`, `Owners`],
    aliases: [`si`, `serverdesc`]
}