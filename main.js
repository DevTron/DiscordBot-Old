// Required
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// CONSOLE MESSAGES //
client.on('ready', () => {
  console.log(`Bot has started, serving ${client.users.size} users, in ${client.guilds.size} servers!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`Guild Removed: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// COMMANDS //
client.on("message", async message => {
    /* Ignore Bots */
    if(message.author.bot) return;
    
    /* Prefix Requirement */
    if(message.content.indexOf(config.prefix) !== 0) return;
    
    /* Command Splitter */ 
    // +say Is this the real life?
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
        
    if(command === "ping") {
      // Replies with Ping?, then edits message to Pong after math is finished
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    
    if(command === "say") {
      /* Puts Args back into sentence */
      const sayMessage = args.join(" ");
      /* Deletes command */
      message.delete().catch(O_o=>{}); 
      /* Message Sent */
      message.channel.send(sayMessage);
    }
    
    if(command === "kick") {
      // Hardcoded Role Check
      if(!message.member.roles.some(r=>["Admin", "DevTron"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");
      
      // Turn user into ID and check for kick potential
      let member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.kickable) 
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
      
      // Remove Username and apply reason
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      // Now, time for a swift kick in the nuts!
      await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  
    }
    
    if(command === "ban") {
      // Same as kick but ban
      if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");
      
      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }
    
    if(command === "purge") {
      // 100 Limit
      
      // puts number into variable
      const deleteCount = parseInt(args[0], 10);
      
      // Number between 2-100 check
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
      
      // Fetch messages based on deleteCount then delete
      const fetched = await message.channel.fetchMessages({count: deleteCount});
      message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
  });

client.login(config.token);