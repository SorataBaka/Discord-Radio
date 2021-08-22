const { MessageEmbed } = require("discord.js")
const prefix = process.env.PREFIX
module.exports = {
  name: "info",
  description: "Lists the information of the bot",
  usage: `${prefix} info`,

  async execute(message, client, args) {
    const embed = new MessageEmbed()
      .setTitle(`Basic bot information`)
      .addField("Created by: ", "Sorata#7763")
      .addField("Created on: ", "23 August 2021")
      .setFooter("2021 All rights reserved. Do not redistribute without permission.")
      .setColor("#E17D68")
    return message.channel.send({embeds: [embed]})
  }
}