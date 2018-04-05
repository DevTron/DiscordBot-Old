exports.run = (client, guild) => {
    console.log(`Guild Removed: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
}