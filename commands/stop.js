const prefix = process.env.PREFIX
module.exports = {
  name: "stop",
  description: "Stops an ongoing stream if exists",
  usage: `${prefix} stop`,
  async execute(message, client, args) {
    if(!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_SERVER")) return message.reply("I'm sorry, you don't have permission to use this command!")
    if(!client.player || !client.player.connection) return message.reply("No available connection exists")

    if(client.player.connection._state.status == "ready"){
      await client.connection.destroy()
      const stopPlayer = await client.player.stop()
      clearInterval(client.interval)
      if(stopPlayer) return message.reply("Successfully stopped stream")
      return message.reply("Failed to stop stream")
    }else{
      return message.reply("No available streams!")
    }
   
  }
}