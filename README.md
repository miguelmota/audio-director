# audio-director

> Manage browser audio sources and playback

# Install

```bash
npm install audio-director
```

# Documentation

[https://lab.miguelmota.com/audio-director](https://lab.miguelmota.com/audio-director/docs)

## Classes

<dl>
<dt><a href="#Player">Player</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#Player">Player</a> : <code>object</code></dt>
<dd><p>Class reprensenting a Player</p>
</dd>
</dl>

<a name="Player"></a>

## Player
**Kind**: global class

* [Player](#Player)
    * [new Player()](#new_Player_new)
    * _instance_
        * [.on(eventName, callback)](#Player+on)
        * [.getCurrentUrl()](#Player+getCurrentUrl) ⇒ <code>String</code>
        * [.emptyQueue()](#Player+emptyQueue) ⇒ <code>Promise</code>
        * [.enqueue(source)](#Player+enqueue) ⇒ <code>Promise</code>
        * [.deque()](#Player+deque) ⇒ <code>Promise</code>
        * [.play()](#Player+play) ⇒ <code>Promise</code>
        * [.playQueue()](#Player+playQueue) ⇒ <code>Promise</code>
        * [.stop()](#Player+stop) ⇒ <code>Promise</code>
        * [.pause()](#Player+pause) ⇒ <code>Promise</code>
        * [.replay()](#Player+replay) ⇒ <code>Promise</code>
        * [.playBlob(blob)](#Player+playBlob) ⇒ <code>Promise</code>
        * [.playAudioBuffer(audioBuffer)](#Player+playAudioBuffer) ⇒ <code>Promise</code>
        * [.getCurrentAudioBuffer()](#Player+getCurrentAudioBuffer) ⇒ <code>AudioBuffer</code>
        * [.playUrl(url)](#Player+playUrl) ⇒ <code>Promise</code>
        * [.getAudioDataFromUrl(url)](#Player+getAudioDataFromUrl) ⇒ <code>Promise</code>
        * [.next()](#Player+next) ⇒ <code>Promise</code>
        * [.previous()](#Player+previous) ⇒ <code>Promise</code>
        * [.setRandom(enabled)](#Player+setRandom) ⇒ <code>Promise</code>
        * [.setRepeat(enabled)](#Player+setRepeat) ⇒ <code>Promise</code>
        * [.hasNext()](#Player+hasNext) ⇒ <code>Boolean</code>
        * [.hasPrevious()](#Player+hasPrevious) ⇒ <code>Boolean</code>
        * [.setPlaybackRate(playbackRate)](#Player+setPlaybackRate) ⇒ <code>Promise</code>
        * [.getPlaybackRate()](#Player+getPlaybackRate) ⇒ <code>Number</code>
        * [.setVolume(volume)](#Player+setVolume) ⇒ <code>Promise</code>
        * [.getVolume()](#Player+getVolume) ⇒ <code>Number</code>
        * [.setMaxVolume(maxVolume)](#Player+setMaxVolume) ⇒ <code>Promise</code>
        * [.getMaxVolume()](#Player+getMaxVolume) ⇒ <code>Number</code>
        * [.setMuted(enabled)](#Player+setMuted) ⇒ <code>Promise</code>
        * [.getCurrentTime()](#Player+getCurrentTime) ⇒ <code>Number</code>
        * [.seekTo(seconds)](#Player+seekTo) ⇒ <code>Promise</code>
        * [.getDuration()](#Player+getDuration) ⇒ <code>Number</code>
        * [.getCurrentState()](#Player+getCurrentState) ⇒ <code>String</code>
    * _static_
        * [.EventTypes](#Player.EventTypes) ⇒ <code>Object</code>

<a name="new_Player_new"></a>

### new Player()
Create a Player

<a name="Player+on"></a>

### player.on(eventName, callback)
Listen for player events

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | name of even |
| callback | <code>function</code> | called when the event occurs |

**Example**
```js
player.on(Player.EventTypes.PLAY, () => {

})
```
**Example**
```js
player.on(Player.EventTypes.PLAYBACK_RATE, () => {

})
```
<a name="Player+getCurrentUrl"></a>

### player.getCurrentUrl() ⇒ <code>String</code>
Get currently playing audio source url

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
const url = player.getCurrentUrl()
```
<a name="Player+emptyQueue"></a>

### player.emptyQueue() ⇒ <code>Promise</code>
Empties queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.emptyQueue()
```
<a name="Player+enqueue"></a>

### player.enqueue(source) ⇒ <code>Promise</code>
Enqueues an audio source to play

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| source | <code>DataView</code> \| <code>Uint8Array</code> \| <code>AudioBuffer</code> \| <code>ArrayBuffer</code> \| <code>String</code> | an audio source to play |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.enqueue(url)
```
**Example**
```js
player.enqueue(audioBuffer)
```
**Example**
```js
player.enqueue(arrayBuffer)
```
**Example**
```js
player.enqueue(blob)
```
<a name="Player+deque"></a>

### player.deque() ⇒ <code>Promise</code>
Deques an audio source from queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.deque()
```
<a name="Player+play"></a>

### player.play() ⇒ <code>Promise</code>
Plays current audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.play()
```
<a name="Player+playQueue"></a>

### player.playQueue() ⇒ <code>Promise</code>
Start playing audio sources in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.playQueue()
```
<a name="Player+stop"></a>

### player.stop() ⇒ <code>Promise</code>
Stop playing current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.stop()
```
<a name="Player+pause"></a>

### player.pause() ⇒ <code>Promise</code>
Pause playing current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.pause()
```
<a name="Player+replay"></a>

### player.replay() ⇒ <code>Promise</code>
Replay current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.replay()
```
<a name="Player+playBlob"></a>

### player.playBlob(blob) ⇒ <code>Promise</code>
Play an audio Blob

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| blob | <code>Blob</code> | audio blob |

**Example**
```js
const blob = new Blob([dataView], {
  type: 'audio/wav'
})

player.playBlob(blob)
```
<a name="Player+playAudioBuffer"></a>

### player.playAudioBuffer(audioBuffer) ⇒ <code>Promise</code>
Play an AudioBuffer

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| audioBuffer | <code>AudioBuffer</code> | an AudioBuffer |

**Example**
```js
player.playAudioBuffer(audioBuffer)
```
<a name="Player+getCurrentAudioBuffer"></a>

### player.getCurrentAudioBuffer() ⇒ <code>AudioBuffer</code>
Return current audio buffer playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.getCurrentAudioBuffer()
```
<a name="Player+playUrl"></a>

### player.playUrl(url) ⇒ <code>Promise</code>
Play an MP3 url

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | MP3 url |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.playUrl(url)
```
<a name="Player+getAudioDataFromUrl"></a>

### player.getAudioDataFromUrl(url) ⇒ <code>Promise</code>
Get the binary audio data from an audio source url in ArrayBuffer form

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Promise</code> - arrayBuffer

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | audio source url |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.getAudioDataFromUrl()
.then(arrayBuffer => {

})
```
<a name="Player+next"></a>

### player.next() ⇒ <code>Promise</code>
Play next audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.next()
```
<a name="Player+previous"></a>

### player.previous() ⇒ <code>Promise</code>
Play previous audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.previous()
```
<a name="Player+setRandom"></a>

### player.setRandom(enabled) ⇒ <code>Promise</code>
Enable to disable random playback

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable random playback |

**Example**
```js
player.setRandom(true)
```
<a name="Player+setRepeat"></a>

### player.setRepeat(enabled) ⇒ <code>Promise</code>
Enable to disable repeat mode. Repeat mode replays the audio sources once the entire queue has finished playing.

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable repeat mode |

**Example**
```js
player.setRepeat(true)
```
<a name="Player+hasNext"></a>

### player.hasNext() ⇒ <code>Boolean</code>
Return true if there's an audio source to play next in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Boolean</code> - hasNext
**Example**
```js
const hasNext = player.hasNext()
```
<a name="Player+hasPrevious"></a>

### player.hasPrevious() ⇒ <code>Boolean</code>
Return true if there's a previous audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Boolean</code> - hasPrevious
**Example**
```js
const hasPrevious = player.hasPrevious()
```
<a name="Player+setPlaybackRate"></a>

### player.setPlaybackRate(playbackRate) ⇒ <code>Promise</code>
Set the plaback rate speed, range 0.75-2

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| playbackRate | <code>Number</code> | new playback rate |

**Example**
```js
player.setPlaybackRate(2)
```
<a name="Player+getPlaybackRate"></a>

### player.getPlaybackRate() ⇒ <code>Number</code>
Get the current plaback rate speed

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - playback rate speed
**Example**
```js
const playbackRate = player.getPlaybackRate()
```
<a name="Player+setVolume"></a>

### player.setVolume(volume) ⇒ <code>Promise</code>
Set volume, range 0-1

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>Number</code> | volume value |

**Example**
```js
player.setVolume(0.9)
```
<a name="Player+getVolume"></a>

### player.getVolume() ⇒ <code>Number</code>
Get current volume value

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - volume - current volume value
**Example**
```js
player.getVolume()
```
<a name="Player+setMaxVolume"></a>

### player.setMaxVolume(maxVolume) ⇒ <code>Promise</code>
Set the maximum volume limit. For example if max volume is set to 0.6, then when volume is scaled from 0-0.6, meaning that volume level at 1 will play at 0.6

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| maxVolume | <code>Number</code> | max volume, range 0-1 |

**Example**
```js
player.setMaxVolume(0.8)
```
<a name="Player+getMaxVolume"></a>

### player.getMaxVolume() ⇒ <code>Number</code>
Get max volume value

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - maxVolume - max volume value
**Example**
```js
player.getMaxVolume()
```
<a name="Player+setMuted"></a>

### player.setMuted(enabled) ⇒ <code>Promise</code>
Set volume level to muted

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable mute |

**Example**
```js
player.setMuted(true)
```
<a name="Player+getCurrentTime"></a>

### player.getCurrentTime() ⇒ <code>Number</code>
Return elapsed time in seconds since the audio source started playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - time - current time
**Example**
```js
player.getCurrentTime()
```
<a name="Player+seekTo"></a>

### player.seekTo(seconds) ⇒ <code>Promise</code>
Seek to a specified time in audio source

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>Number</code> | number of seconds to seek to |

**Example**
```js
const seconds = 45

player.seekTo(seconds)
```
<a name="Player+getDuration"></a>

### player.getDuration() ⇒ <code>Number</code>
Get duration of audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - duration - duration of audio source
**Example**
```js
player.getDuration()
```
<a name="Player+getCurrentState"></a>

### player.getCurrentState() ⇒ <code>String</code>
Get current state of player

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>String</code> - - current state
**Example**
```js
const currentState = player.getCurrentState()

console.log(currentState) // 'playing'
```
<a name="Player.EventTypes"></a>

### Player.EventTypes ⇒ <code>Object</code>
Return event types

**Kind**: static property of [<code>Player</code>](#Player)
**Returns**: <code>Object</code> - eventTypes - all player event types
**Example**
```js
const EventTypes = Player.EventTypes

{
      LOG: 'log',
      ERROR: 'error',
      READY: 'ready',
      PLAY: 'play',
      REPLAY: 'replay',
      PAUSE: 'pause',
      STOP: 'pause',
      NEXT: 'next',
      PREVIOUS: 'previous',
      RANDOM: 'random',
      REPEAT: 'repeat',
      PLAYBACK_RATE: 'playbackRate',
      VOLUME: 'volume',
      MAX_VOLUME: 'maxVolume',
      MUTED: 'muted',
      ENDED: 'ended',
      ENQUEUE: 'enqueue',
      DEQUE: 'deque',
      EMPTY_QUEUE: 'emptyQueue',
      STATE_CHANGE: 'stateChange'
}
```
<a name="Player"></a>

## Player : <code>object</code>
Class reprensenting a Player

**Kind**: global namespace
**Example**
```js
const player = new Player()
```

* [Player](#Player) : <code>object</code>
    * [new Player()](#new_Player_new)
    * _instance_
        * [.on(eventName, callback)](#Player+on)
        * [.getCurrentUrl()](#Player+getCurrentUrl) ⇒ <code>String</code>
        * [.emptyQueue()](#Player+emptyQueue) ⇒ <code>Promise</code>
        * [.enqueue(source)](#Player+enqueue) ⇒ <code>Promise</code>
        * [.deque()](#Player+deque) ⇒ <code>Promise</code>
        * [.play()](#Player+play) ⇒ <code>Promise</code>
        * [.playQueue()](#Player+playQueue) ⇒ <code>Promise</code>
        * [.stop()](#Player+stop) ⇒ <code>Promise</code>
        * [.pause()](#Player+pause) ⇒ <code>Promise</code>
        * [.replay()](#Player+replay) ⇒ <code>Promise</code>
        * [.playBlob(blob)](#Player+playBlob) ⇒ <code>Promise</code>
        * [.playAudioBuffer(audioBuffer)](#Player+playAudioBuffer) ⇒ <code>Promise</code>
        * [.getCurrentAudioBuffer()](#Player+getCurrentAudioBuffer) ⇒ <code>AudioBuffer</code>
        * [.playUrl(url)](#Player+playUrl) ⇒ <code>Promise</code>
        * [.getAudioDataFromUrl(url)](#Player+getAudioDataFromUrl) ⇒ <code>Promise</code>
        * [.next()](#Player+next) ⇒ <code>Promise</code>
        * [.previous()](#Player+previous) ⇒ <code>Promise</code>
        * [.setRandom(enabled)](#Player+setRandom) ⇒ <code>Promise</code>
        * [.setRepeat(enabled)](#Player+setRepeat) ⇒ <code>Promise</code>
        * [.hasNext()](#Player+hasNext) ⇒ <code>Boolean</code>
        * [.hasPrevious()](#Player+hasPrevious) ⇒ <code>Boolean</code>
        * [.setPlaybackRate(playbackRate)](#Player+setPlaybackRate) ⇒ <code>Promise</code>
        * [.getPlaybackRate()](#Player+getPlaybackRate) ⇒ <code>Number</code>
        * [.setVolume(volume)](#Player+setVolume) ⇒ <code>Promise</code>
        * [.getVolume()](#Player+getVolume) ⇒ <code>Number</code>
        * [.setMaxVolume(maxVolume)](#Player+setMaxVolume) ⇒ <code>Promise</code>
        * [.getMaxVolume()](#Player+getMaxVolume) ⇒ <code>Number</code>
        * [.setMuted(enabled)](#Player+setMuted) ⇒ <code>Promise</code>
        * [.getCurrentTime()](#Player+getCurrentTime) ⇒ <code>Number</code>
        * [.seekTo(seconds)](#Player+seekTo) ⇒ <code>Promise</code>
        * [.getDuration()](#Player+getDuration) ⇒ <code>Number</code>
        * [.getCurrentState()](#Player+getCurrentState) ⇒ <code>String</code>
    * _static_
        * [.EventTypes](#Player.EventTypes) ⇒ <code>Object</code>

<a name="new_Player_new"></a>

### new Player()
Create a Player

<a name="Player+on"></a>

### player.on(eventName, callback)
Listen for player events

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | name of even |
| callback | <code>function</code> | called when the event occurs |

**Example**
```js
player.on(Player.EventTypes.PLAY, () => {

})
```
**Example**
```js
player.on(Player.EventTypes.PLAYBACK_RATE, () => {

})
```
<a name="Player+getCurrentUrl"></a>

### player.getCurrentUrl() ⇒ <code>String</code>
Get currently playing audio source url

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
const url = player.getCurrentUrl()
```
<a name="Player+emptyQueue"></a>

### player.emptyQueue() ⇒ <code>Promise</code>
Empties queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.emptyQueue()
```
<a name="Player+enqueue"></a>

### player.enqueue(source) ⇒ <code>Promise</code>
Enqueues an audio source to play

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| source | <code>DataView</code> \| <code>Uint8Array</code> \| <code>AudioBuffer</code> \| <code>ArrayBuffer</code> \| <code>String</code> | an audio source to play |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.enqueue(url)
```
**Example**
```js
player.enqueue(audioBuffer)
```
**Example**
```js
player.enqueue(arrayBuffer)
```
**Example**
```js
player.enqueue(blob)
```
<a name="Player+deque"></a>

### player.deque() ⇒ <code>Promise</code>
Deques an audio source from queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.deque()
```
<a name="Player+play"></a>

### player.play() ⇒ <code>Promise</code>
Plays current audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.play()
```
<a name="Player+playQueue"></a>

### player.playQueue() ⇒ <code>Promise</code>
Start playing audio sources in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.playQueue()
```
<a name="Player+stop"></a>

### player.stop() ⇒ <code>Promise</code>
Stop playing current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.stop()
```
<a name="Player+pause"></a>

### player.pause() ⇒ <code>Promise</code>
Pause playing current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.pause()
```
<a name="Player+replay"></a>

### player.replay() ⇒ <code>Promise</code>
Replay current audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.replay()
```
<a name="Player+playBlob"></a>

### player.playBlob(blob) ⇒ <code>Promise</code>
Play an audio Blob

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| blob | <code>Blob</code> | audio blob |

**Example**
```js
const blob = new Blob([dataView], {
  type: 'audio/wav'
})

player.playBlob(blob)
```
<a name="Player+playAudioBuffer"></a>

### player.playAudioBuffer(audioBuffer) ⇒ <code>Promise</code>
Play an AudioBuffer

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| audioBuffer | <code>AudioBuffer</code> | an AudioBuffer |

**Example**
```js
player.playAudioBuffer(audioBuffer)
```
<a name="Player+getCurrentAudioBuffer"></a>

### player.getCurrentAudioBuffer() ⇒ <code>AudioBuffer</code>
Return current audio buffer playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.getCurrentAudioBuffer()
```
<a name="Player+playUrl"></a>

### player.playUrl(url) ⇒ <code>Promise</code>
Play an MP3 url

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | MP3 url |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.playUrl(url)
```
<a name="Player+getAudioDataFromUrl"></a>

### player.getAudioDataFromUrl(url) ⇒ <code>Promise</code>
Get the binary audio data from an audio source url in ArrayBuffer form

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Promise</code> - arrayBuffer

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | audio source url |

**Example**
```js
const url = 'https://example.com/audio.mp3'

player.getAudioDataFromUrl()
.then(arrayBuffer => {

})
```
<a name="Player+next"></a>

### player.next() ⇒ <code>Promise</code>
Play next audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.next()
```
<a name="Player+previous"></a>

### player.previous() ⇒ <code>Promise</code>
Play previous audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
player.previous()
```
<a name="Player+setRandom"></a>

### player.setRandom(enabled) ⇒ <code>Promise</code>
Enable to disable random playback

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable random playback |

**Example**
```js
player.setRandom(true)
```
<a name="Player+setRepeat"></a>

### player.setRepeat(enabled) ⇒ <code>Promise</code>
Enable to disable repeat mode. Repeat mode replays the audio sources once the entire queue has finished playing.

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable repeat mode |

**Example**
```js
player.setRepeat(true)
```
<a name="Player+hasNext"></a>

### player.hasNext() ⇒ <code>Boolean</code>
Return true if there's an audio source to play next in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Boolean</code> - hasNext
**Example**
```js
const hasNext = player.hasNext()
```
<a name="Player+hasPrevious"></a>

### player.hasPrevious() ⇒ <code>Boolean</code>
Return true if there's a previous audio source in queue

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Boolean</code> - hasPrevious
**Example**
```js
const hasPrevious = player.hasPrevious()
```
<a name="Player+setPlaybackRate"></a>

### player.setPlaybackRate(playbackRate) ⇒ <code>Promise</code>
Set the plaback rate speed, range 0.75-2

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| playbackRate | <code>Number</code> | new playback rate |

**Example**
```js
player.setPlaybackRate(2)
```
<a name="Player+getPlaybackRate"></a>

### player.getPlaybackRate() ⇒ <code>Number</code>
Get the current plaback rate speed

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - playback rate speed
**Example**
```js
const playbackRate = player.getPlaybackRate()
```
<a name="Player+setVolume"></a>

### player.setVolume(volume) ⇒ <code>Promise</code>
Set volume, range 0-1

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| volume | <code>Number</code> | volume value |

**Example**
```js
player.setVolume(0.9)
```
<a name="Player+getVolume"></a>

### player.getVolume() ⇒ <code>Number</code>
Get current volume value

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - volume - current volume value
**Example**
```js
player.getVolume()
```
<a name="Player+setMaxVolume"></a>

### player.setMaxVolume(maxVolume) ⇒ <code>Promise</code>
Set the maximum volume limit. For example if max volume is set to 0.6, then when volume is scaled from 0-0.6, meaning that volume level at 1 will play at 0.6

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| maxVolume | <code>Number</code> | max volume, range 0-1 |

**Example**
```js
player.setMaxVolume(0.8)
```
<a name="Player+getMaxVolume"></a>

### player.getMaxVolume() ⇒ <code>Number</code>
Get max volume value

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - maxVolume - max volume value
**Example**
```js
player.getMaxVolume()
```
<a name="Player+setMuted"></a>

### player.setMuted(enabled) ⇒ <code>Promise</code>
Set volume level to muted

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| enabled | <code>Boolean</code> | boolean to enable mute |

**Example**
```js
player.setMuted(true)
```
<a name="Player+getCurrentTime"></a>

### player.getCurrentTime() ⇒ <code>Number</code>
Return elapsed time in seconds since the audio source started playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - time - current time
**Example**
```js
player.getCurrentTime()
```
<a name="Player+seekTo"></a>

### player.seekTo(seconds) ⇒ <code>Promise</code>
Seek to a specified time in audio source

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>Number</code> | number of seconds to seek to |

**Example**
```js
const seconds = 45

player.seekTo(seconds)
```
<a name="Player+getDuration"></a>

### player.getDuration() ⇒ <code>Number</code>
Get duration of audio source

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>Number</code> - duration - duration of audio source
**Example**
```js
player.getDuration()
```
<a name="Player+getCurrentState"></a>

### player.getCurrentState() ⇒ <code>String</code>
Get current state of player

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>String</code> - - current state
**Example**
```js
const currentState = player.getCurrentState()

console.log(currentState) // 'PLAYING'
```
<a name="Player.EventTypes"></a>

### Player.EventTypes ⇒ <code>Object</code>
Return event types

**Kind**: static property of [<code>Player</code>](#Player)
**Returns**: <code>Object</code> - eventTypes - all player event types
**Example**
```js
const EventTypes = Player.EventTypes

{
      LOG: 'log',
      ERROR: 'error',
      READY: 'ready',
      PLAY: 'play',
      REPLAY: 'replay',
      PAUSE: 'pause',
      STOP: 'pause',
      NEXT: 'next',
      PREVIOUS: 'previous',
      RANDOM: 'random',
      REPEAT: 'repeat',
      PLAYBACK_RATE: 'playbackRate',
      VOLUME: 'volume',
      MAX_VOLUME: 'maxVolume',
      MUTED: 'muted',
      ENDED: 'ended',
      ENQUEUE: 'enqueue',
      DEQUE: 'deque',
      EMPTY_QUEUE: 'emptyQueue',
      STATE_CHANGE: 'stateChange'
}
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
