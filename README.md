# audio-director

> Mange audio playback

# Documentation

[https://lab.miguelmota.com/audio-director](https://lab.miguelmota.com/audio-director/docs)

# Install

```bash
npm install audio-director
```

# Usage

Standard audio player

```
const {Player} = require('audio-director')
const player = new Player()

// add audio source(s) to play queue. Converts input to AudioBuffer.
player.enqueue(dataView|typedArray|arrayBuffer|url)
.then(audioBuffer => {
  player.play()
})
```

[Full documentation](https://lab.miguelmota.com/audio-director/docs/Player.html)

YouTube player

```
const {YoutubePlayer} = require('audio-director')
const player = new YoutubePlayer()

const url = 'https://www.youtube.com/watch?v=_5joTyy3CCo&list=RDQMc4l8l2aQrNo'

player.enqueue(url)
.then(() => player.play())
```

[Full documentation](https://lab.miguelmota.com/audio-director/docs/YoutubePlayer.html)

# License

MIT
