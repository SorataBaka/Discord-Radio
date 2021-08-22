const {
	NoSubscriberBehavior,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	entersState,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	joinVoiceChannel,
  generateDependencyReport
} = require('@discordjs/voice');
const ytdl = require('ytdl-core')
console.log(generateDependencyReport())
const prefix = process.env.PREFIX
module.exports = {
  name: "stream",
  description: "Streams an audio from a LIVE youtube source",
  usage: `${prefix} stream {Youtube LIVE URL}`,
  async execute(message, client, args) {
    if(client.voice.adapters.has(message.guild.id))return message.reply("The bot is already active. Please stop it first.")
    if(!args) return message.reply("Please provide a link to a youtube stream!")
    if(!ytdl.validateURL(args)) return message.reply("Invalid URL provided")
    if(!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_SERVER")) return message.reply("I'm sorry, you don't have permission to use this command!")

    const stream = ytdl(args, {quality: "highest"})
    if(!message.member.voice.channel) return message.reply("You are currently not in a voice channel!")
    const voiceChannel = message.member.voice.channel

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
        maxMissedFrames: Math.round(5000 / 20)
      }
    })
    client.player = player
    player.on('stateChange', (oldState, newState) => {
      if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
        console.log('Playing audio output on audio player');
        message.reply("Playing audio output on audio channel")
      } else if (newState.status === AudioPlayerStatus.Idle) {
        console.log('Playback has stopped. Attempting to restart.');
        message.reply("Playback stopped, attempting to restart")
        const resource = createAudioResource(stream)
        player.play(resource,{inputType: StreamType.OggOpus})
      }
      if(newState.status == "autopaused"){
        return player.stop()
      }
    })
    // {filter: "audioonly", quality: "highest", liveBuffer: 60000, highWaterMark: 1 << 25}
    const resource = createAudioResource(stream)
    player.play(resource,{inputType: StreamType.OggOpus})
    const connectToChannel = async(channel) => {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      })
      client.player.connection = connection
      const ready = await entersState(connection, VoiceConnectionStatus.Ready, 30_000).catch(err => {
        console.error(err)
        return message.reply("Error joining voice channel")
      })
      if(ready) return connection
      }
    
    const connection = await connectToChannel(voiceChannel);
    if(!connection) return message.reply("It seems like there has been a problem joining your channel! Please make sure it is not locked or full.")
    const subscribe = await connection.subscribe(player)
    if(subscribe) return message.reply("Now streaming music")
  }
}