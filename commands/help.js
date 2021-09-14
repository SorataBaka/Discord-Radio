const { MessageEmbed } = require("discord.js")
const prefix = process.env['PREFIX']
module.exports = {
  name: "help",
  description: "Lists every available command on the bot",
  usage: `${prefix} help or ${prefix} help {command name} for more information on a command.`,

  async execute(message, client, args) {
    if(args){
      const argsSplitted = args.split(" ")
      const commandName = argsSplitted[0]
      if(!client.commands.has(commandName))return message.reply("The command you provided doesn't exist! Are you sure you typed it correctly?")
      const commandData = client.commands.get(commandName)
      const embed = new MessageEmbed()
        .setTitle(`Help module for ${client.user.username} discord Bot`)
        .addField(`Command Name: `, commandData.name)
        .addField("Command Description: ", commandData.description)
        .addField("Usage: ", commandData.usage)
        .setTimestamp()
        .setColor("#E17D68")
        .setFooter(`Do ${prefix} help {command name} to get more information about a command.`)
      return message.channel.send({embeds: [embed]})
    }

    const commandArray = client.commands
    var stringArray = [];
    commandArray.forEach((data, key) => {
      const commandName = "`"+key+"`"
      stringArray.push(commandName)
    })
    stringArray.join(" ")
    const embed = new MessageEmbed()
      .setTitle(`Help module for ${client.user.username} discord Bot`)
      .addField("Commands", stringArray.join(" "))
      .setTimestamp()
      .setFooter(`Do ${prefix} help {command name} to get more information about a command.`)
    return message.channel.send({embeds: [embed]})
  }
}