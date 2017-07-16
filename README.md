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

```javascript
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

```javascript
const {YoutubePlayer} = require('audio-director')
const player = new YoutubePlayer()

const url = 'https://www.youtube.com/watch?v=_5joTyy3CCo&list=RDQMc4l8l2aQrNo'

player.enqueue(url)
.then(() => player.play())
```

[Full documentation](https://lab.miguelmota.com/audio-director/docs/YoutubePlayer.html)

# Example

[Live basic example](https://lab.miguelmota.com/audio-director/example)

# Source

[https://github.com/miguelmota/audio-director](https://github.com/miguelmota/audio-director)

# License

MIT
