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
const client = new Discord.Client()
const guildInvites = new Map();
client.on(`inviteCreate`, async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchedInvites()))
client.on(`ready`, () => {
    console.log(`Logged In!`)
    client.user.setPresence({
        game: { 
            name: 'd!help',
            type: 'WATCHING'
        },
        status: 'idle'
    })
    client.guilds.cache.forEach(guild =>
            guild.fetchInvites()
                .then(invites => guildInvites.set(guild.id, invites))
                .catch(err => console.log(err))
    )
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
    .setFooter(`DiamantBot | © Diamant#9542 | ${moment.utc().format(`DD MMMM HH:mm`).add("3","hours")}`, client.user.displayAvatarURL());
    if(!commandfile) {message.channel.send({embed: unknown})}


})

// Invite Manager

client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id)
    const newInvites = await member.guild.fetchInvites()
    const systemChannel = db.fetch(`${member.guild.id}_systemChannel`) || member.guild.systemChannel
    guildInvites.set(member.guild.id, newInvites)
    try {
        const owner = member.guild.owner
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses)
        systemChannel.send(`<@${member.user.id}> joined to server. Welcome to ${member.guild.name}`)
        if(!systemChannel) {
            owner.send(`Your server's (${member.guild.name}) doesn't have any system channel. Please `)
        }
        db.set(`${member.user.id}_inviteFrom`, usedInvite.inviter.id)
        db.add(`${usedInvite.inviter.id}_inviteAmount`, 1)
    }
    catch(err) {
        console.log(err)
    }
});

client.on('guildMemberRemove', member => {
    const systemChannel = db.fetch(`${member.guild.id}_systemChannel`) || member.guild.systemChannel
    const inviter = db.fetch(`${member.user.id}_inviteFrom`)
    try {
        systemChannel.send(`<@${member.user.id}> left from the server.`)
        db.add(`${inviter}_inviteAmount`, -1)
    }
    catch(err) {
        console.log(err)
    }
});

client.login(process.env.TOKEN);