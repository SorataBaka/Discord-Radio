<h1 align="center"> Discord-Radio </h1>

**A 24/7 Discord music streaming bot**

```docker pull christianharjuno/discord-radio:latest```

Simple and light Discord Bot that streams opus audio from a Youtube LIVE Source using the Ytdl package. 

To reduce the load caused by routing audio from youtube to Discord Voice Channels, this bot uses the Ytdl-Discord wrapper to avoid useless encodings.

<hr>

| Package Name| Version |
| :----------- | :-----------: |
| discord.js | 13.1.0 |
| @discordjs/opus | 0.5.3 |
| @discordjs/voice   | 0.6.0  |
|ffmpeg-static|4.4.0|
|libsodium-wrappers|0.7.9|
|ytdl-core-discord|1.3.1|


<hr>


**discord.js**: Powerful Node.JS module to enable easy interaction with discord's API.

**@discordjs/voice**: Discord.JS Voice module. Support for voice has been deprecated ever since Discord.JS v13 so a propritary module is required to support voice.

**@discordjs/opus**: Opus encoding library to encode the audio source streamed into a discord voice channel.

**ffmpeg-static**: A library to enable playing many types of audio sources. 

**libsodium-wrappers**: An encryption module to encrypt outgoing audio streams to the discord API.

**ytdl-core-discord**: An API wrapper that simplifies the already popular ytdl-core module to create a stream from a youtube LIVE.

<hr>

**Step by step to deploy:** </br>
1. Before starting, make sure you have the latest Node.JS Installed on your machine.
2. First clone or download the repo.
3. Open the folder via a code editor and create a new file with the name ".env"
4. Fill in the .env file with a bot token and prefix like such: </br>
<code>
TOKEN="FILL_THIS_WITH_THE_TOKEN_OF_YOUR_DISCORD_BOT"</br>
PREFIX="APREFIX"
</code>
<br>
*make sure both of the token and prefix is provided or it will not run properly.*
4. Open a console from the bot folder and run <code>npm install</code>
5. Once every package is completely installed, run <code>npm start</code>

<hr>

Latest update to add support for hosting on replit.
