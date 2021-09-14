const discord = require("discord.js");
const express = require("express");
const axios = require("axios")
const fs = require("fs")
require("dotenv").config()

const TOKEN = process.env['TOKEN']
const PORT = process.env['PORT'] || 7000

const botIntents = new discord.Intents(IntentsBot = Object.values(discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0))
const client = new discord.Client({intents: botIntents})
const app = express()

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


const keepAlive = async() => {
  app.all("/", (req, res) => {
    res.send("Bot is online")
  })
  app.listen(PORT, () => {
    console.log("Bot is now online and listening to port 3000")
  })
  
  setInterval(async function() {
    const ping = await axios.get(`http://localhost:${PORT}`)
    if(!ping) return console.log("The bot may be offline!")
    console.log(ping.data)
  }, 30000)
}

if(process.env['REPLIT'].toLowerCase() == 'true'){
  console.log("Replit enabled. Turning on Keep Alive function.")
  return keepAlive()
}else{
  return console.log("Replit disabled. Keep alive function disabled.")
}