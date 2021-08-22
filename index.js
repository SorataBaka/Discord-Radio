const discord = require("discord.js");
const fs = require("fs")
require("dotenv").config()

const TOKEN = process.env.TOKEN

const botIntents = new discord.Intents(IntentsBot = Object.values(discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0))
const client = new discord.Client({intents: botIntents})


//Load Events
client.commands = new discord.Collection()

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

for(file of eventFiles){
  const event = require(`./events/${file}`)
  client.on(event.eventName, (...args) => event.execute(...args, client))
}
for(file of commandFiles){
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.login(TOKEN)