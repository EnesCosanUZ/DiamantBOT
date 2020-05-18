const Discord = require(`discord.js`)
const moment = require(`moment`)
const colours = require(`../colours.json`);
const db = require(`quick.db`)

module.exports.run = async (client, message, args) => {
    let uinfo = message.mentions.users.first() || message.author
    let minfo = message.mentions.members.first() || message.member
    let roles = minfo.roles.cache.each(r => r.name)
    let cdate = moment.utc(uinfo.createdAt).format(`DD MMM YYYY ddd HH:mm`)
    let jdate = moment.utc(minfo.joinedAt).format(`DD MMM YYYY ddd HH:mm`)
    let boost = moment.utc(minfo.premiumSince).format(`DD MMM YYYY ddd HH:mm`).replace(`Invalid date`, `Not found!`)
    let uinviter = db.get(`${message.guild.id}_${minfo.id}_inviter`) || "Couldn't Find"
    let uinvited = db.get(`${message.guild.id}_${minfo.id}_inviteAmount`) || "0"
    let uEmbed = new Discord.MessageEmbed()
    .setColor(colours.gold)
    .setAuthor(`${uinfo.username}'s Info`, uinfo.displayAvatarURL({dynamic:"1"}))
    .setThumbnail(uinfo.displayAvatarURL({dynamic:"1", size: 128}))
    .addFields(
        { name: `**▬▬▬▬▬▬ User Stats ▬▬▬▬▬▬**`, value: [
            `**Username#Tag**: *${uinfo.tag}*`,
            `**ID:** *${uinfo.id}*`,
            `**Created At**:   *${cdate}*`,
            `**Status:** *${uinfo.presence.status.replace(`online`, `<:online:705157763596025907>Online!`)
                                                  .replace(`idle`, `<:idle:705157784613945374>Idle!`)
                                                  .replace(`dnd`, `<:dnd:705157808164831415>Do not disturb!`)
                                                  .replace(`offline`, `<:offline:705157819422212237>Offline!`)}*`,  
            ]
        },
        { name: `**▬▬▬▬▬ Server Stats ▬▬▬▬▬**`, value: [
            `**Nickname:** *${minfo.nickname || uinfo.username}*`,
            `**Joined At:** *${jdate}*`,
            `**Invited:** *${uinvited} Member*`,
            `**Inviter:** <@${uinviter}>`,
            `**Role:** *${roles.array()}*`,
            `**Boosting Since:** *${boost}*`,
            ]
        }
    )
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());

    message.channel.send({embed: uEmbed});
}

module.exports.config = {
    name: `userinfo`,
    description: `Pulls the users info of yourself or a user!`,
    usage: `userinfo (@mention)`,
    accessableby: [`Members`, `Owners`],
    aliases: [`ui`]
}