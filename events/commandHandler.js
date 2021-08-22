module.exports = {
  eventName: "messageCreate",
  async execute(message, client) {
    if(!message.guild) return
    if(message.author.bot) return
    const PREFIX = process.env.PREFIX
    //Parse Message
    const parsedMessage = message.content.split(" ")
    if(parsedMessage[0].toUpperCase() == PREFIX.toUpperCase()){
      if(!client.commands.has(parsedMessage[1])) return message.reply("Invalid command! Are you sure you typed it correctly?")
      const content = parsedMessage.slice(2).join(" ")
      client.commands.get(parsedMessage[1].toLowerCase()).execute(message, client, content)
    }

  }
}