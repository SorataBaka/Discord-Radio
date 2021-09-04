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
const ytdl = require('ytdl-core-discord')



console.log(generateDependencyReport())
const prefix = process.env.PREFIX


module.exports = {
  name: "stream",
  description: "Streams an audio from a LIVE youtube source",
  usage: `${prefix} stream {Youtube LIVE URL}`,
  async execute(message, client, args) {
    //Do local checks to see if player is able to use this command and execute function
    if(!args) return message.reply("Please provide a link to a youtube stream!")
    if(!ytdl.validateURL(args)) return message.reply("Invalid URL provided")
    if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("I'm sorry, you don't have permission to use this command!")
    if(!message.member.voice.channel) return message.reply("You are currently not in a voice channel!")

    const voiceChannel = message.member.voice.channel


    //create a stream from youtube and convert it into a playable resource
    var stream = await ytdl(args)
    const resource = createAudioResource(stream)


    //create an audio player to play the resource and play
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
        maxMissedFrames: Math.round(5000 / 20)
      }
    })
    player.play(resource,{inputType: StreamType.OggOpus})

    //at this state the bot is already receiving and streaming music from youtube. 

    const connectToChannel = async(channel) => {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      })
      const ready = await entersState(connection, VoiceConnectionStatus.Ready, 30_000).catch(err => {
        console.error(err)
        return message.reply("Error joining voice channel")
      })
      if(ready) return connection
    }

    //Connect to channel and check if able to establish a connection
    var connection = await connectToChannel(voiceChannel);
    
    const subscribe = connection.subscribe(player)
    if(subscribe) return message.reply("Now streaming music")

    player.on('stateChange', async (oldState, newState) => {
      if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
        message.reply("Playing audio output on audio channel")

      } else if (newState.status === AudioPlayerStatus.Idle) {
        message.reply("Playback stopped, attempting to restart")

        stream.destroy()
        stream = await ytdl(args)
        const resource = createAudioResource(stream)
        player.play(resource,{inputType: StreamType.OggOpus})
      }
    })
    

    const disconnectedEvent = async() => {
      const disconnected = await entersState(connection, VoiceConnectionStatus.Disconnected, 30_000).catch(async (err) => {
        console.error(err)
        
      })
      if(disconnected){
        message.reply("Disconnected. Attempting to rejoin")
        connection = await connectToChannel(voiceChannel);
        if(connection){
          const subscribe = connection.subscribe(player)
          if(subscribe) message.reply("Now streaming music")
          disconnectedEvent()
        }
      }
    }
    disconnectedEvent()

    client.connection = connection
    client.player = player
  }
}