require('dotenv').config() //.env config
const Discord = require(`discord.js`)
const colours = require("./colours.json")
const moment = require(`moment`) //#74
const db = require(`quick.db`)

// OAUTH2 Settings //
const express = require(`express`)
const path = require(`path`)
const app = express()

app.get(`/` , (req, res) => {
    res.status(200).sendFile(path.join(__dirname, `/api/index.html`))
})

app.use(`/api/discord`, require(`./api/discord`))

app.listen(3000, () => {
    console.info(`AOUTH2 running on port 3000!`)
})


// Client Settings //
const invites = {}
const client = new Discord.Client()
client.on(`ready`, () => {
    console.log(`Logged In!`)
    client.user.setPresence({
        game: { 
            name: 'd!help',
            type: 'WATCHING'
        },
        status: 'idle'
    })
    
    let servers = client.guilds.cache
    servers.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        })
    })
});


// Commands Settings //
const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
        return console.log("[LOGS] Couldn`t Find Commands!");
    }
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});
client.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;
    let prefix = process.env.PREFIX
    let dbPrefix = await db.get(`${message.guild.id}_prefix`)
    if(dbPrefix === null) db.set(`${message.guild.id}_prefix`, process.env.PREFIX)
    else prefix = dbPrefix;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args)
    let unknown = new Discord.MessageEmbed()
    .setColor(colours.red_dark)
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`Sorry ${message.author}. This command is unknown.`)
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`)}`, client.user.displayAvatarURL());
    if(!commandfile) {message.channel.send({embed: unknown})}


})

// Invite Manager

client.on('guildMemberAdd', member => {
    if (member.guild.id === `702161798694174770`) return;

    member.guild.fetchInvites().then(guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        var logChannel = member.guild.systemChannel
        
        if(!logChannel){
            member.guild.owner.send(`${member.guild} is not has a system channel or specific login channel. Please make sure your server has a one of them.`)
        } else {
            logChannel.send(`<@${invite.inviter.id}> invite the <@${member.id}> to server. Welcome to ${member.guild.name}.`);   
        }
        db.add(`${member.guild.id}_${invite.inviter.id}_inviteAmount`, 1)
        db.set(`${member.guild.id}_${member.id}_inviter`, `${invite.inviter.id}`)
    });
});

client.on('guildMemberRemove', member => {
    if (member.guild.id === `702161798694174770`) return;
    var logChannel = member.guild.systemChannel
    var inviter = db.get(`${member.guild.id}_${member.id}_inviter`)
    db.add(`${member.guild.id}_${inviter}_inviteAmount`, -1)
    db.delete(`${member.guild.id}_${member.id}_inviter`)

    if(!logChannel){
        member.guild.owner.send(`${member.guild} is not has a system channel or specific login channel. Please make sure your server has a one of them.`)
    } else {
        logChannel.send(`<@${member.id}> left from the server. Onu <@${inviter}> davet etmişti`)
    }
});

client.login(process.env.TOKEN);