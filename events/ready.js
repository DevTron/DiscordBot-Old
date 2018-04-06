exports.run = (client) => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.guilds.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
}