# audio-director

> Mange audio playback

## Install

```bash
npm install audio-director
```

## Usage

```
const AudioDirector = require('audio-director')
const player = new AudioDirector.Player()

player.enqueue(dataView|typedArray|arrayBuffer|url) -> promise(arraybuffer) - add an audio source to play queue. Converts input to AudioBuffer.
player.deque() -> promise() - dequeu an audio source to play
player.play() -> promise() - play next source in queue
player.stop() -> promise() - stop playing
player.replay() -> promise() - replay last audio source played
player.pause() -> promise() - pause playing
player.emptyQueue() -> promise() - empty the queue

player.playBlob(blob) -> promise(blob) - play a blob source
player.playAudioBuffer(audioBuffer) -> promise() - play an AudioBuffer source
player.playUrl(url) -> promise(url) - play mp3 url

player.setPlaybackRate(value 0.75 - 2) -> promise(playbackRate) - set playback rate speed
player.setVolume(value 0 - 1) -> promise(volume) - set volume

player.on(identifier, callback)

identifiers (found under Player.EventTypes object)
  LOG - when a debug log occurs
  ERROR - when an error occurs
  PLAY - when audio source is played
  REPLAY - when audio source is replayed
  PAUSE - when audio source is paused
  STOP - when audio source is stopped playing
  PLAYBACK_RATE - when audio playback rate is changed
  VOLUME - when audio volume is changed
  ENQUEUE - when an audio source is added to queue
  DEQUE - when an audio source is removed from queue
```

## TODO

Better documentation

# License

MIT
