module.exports = {
  eventName : 'ready',
  async execute(client) {
    var memberTotal = 0;
    client.guilds.cache.forEach(guildData => {
      const guildMember = guildData.members.cache.size
      memberTotal = memberTotal + guildMember
    })
    return console.log(`Bot is currently online in ${client.guilds.cache.size} server(s) and serving ${memberTotal} member(s)`)
  }
}