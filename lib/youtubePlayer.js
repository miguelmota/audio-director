const EventEmitter = require('events')
const qs = require('qs')
const {scaleLinear} = require('d3-scale')

const PlayerEventTypes = require('./constants/PlayerEventTypes')

class YoutubePlayer extends EventEmitter {
  constructor() {
    super()

    this._player = null

    this._playbackRateScale = scaleLinear()
    .domain([0.75, 2])
    .range([0.75, 2])
    .clamp(true)

    this._volume = 100
    this._volumeScale = scaleLinear()
    .domain([0, 1])
    .range([0, 100])
    .clamp(true)

    this._isReady = false

    if (!window.onYouTubeIframeAPIReady) {
      const tag = document.createElement('script')

      tag.src = 'https://www.youtube.com/iframe_api'

      const firstScriptTag = document.getElementsByTagName('script')[0]

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = () => {

    }
  }

  _destroyPlayer() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.destroy()
      }

      if (this._player) {
        this._playerEl.remove()
      }

      return resolve()
    })
  }

  _setPlayer(props) {
    if (!props) {
      props = {}
    }

    const {videoId, playlistId} = props

    return new Promise((resolve, reject) => {
      this._destroyPlayer()

      this._playerEl = document.createElement('div')
      this._playerEl.cssText = 'position:absolute;left:-1000px;bottom:-1000px;visibility:hidden;pointer-events:none'
      this._playerEl.id = `player_${Math.random()*1e10|0}`
      document.body.appendChild(this._playerEl)

      this._player = new YT.Player(this._playerEl.id, {
        height: 1,
        width: 1,
        events: {
          onReady: this._onPlayerReady.bind(this),
          onStateChange: this._onPlayerStateChange.bind(this)
        },
        videoId: videoId,
        playerVars: {
          listType: 'playlist',
          list: playlistId
        }
      })
    })
  }

  _onPlayerReady(event) {
    this._isReady = true
    this._log('Player ready');
    this.emit(PlayerEventTypes.READY);
  }

  _onPlayerStateChange(event) {
    this._log(`Player state change: ${event.data}`);
    this.emit(PlayerEventTypes.STATE_CHANGE, event.data);
  }

  _log(type, message) {
    if (type && !message) {
      message = type
      type = 'log'
    }

    setTimeout(() => {
      this.emit(PlayerEventTypes.LOG, message)
    }, 0)

    if (this._debug) {
      console[type](message)
    }
  }

  emptyQueue() {
    return new Promise((resolve, reject) => {
      this.stop()

      resolve()
    })
  }

  enqueue(url) {
    return new Promise((resolve, reject) => {
      const query = qs.parse(url.replace(/.*\?/gi, ''))
      const videoId = query.v
      const playlistId = query.list

      if (!videoId) {
        return reject(new Error('videoId not found'))
      }

      return this._setPlayer({
        videoId,
        playlistId
      })

      this._log('Enqueue audio');
      this.emit(PlayerEventTypes.ENQUEUE);

      resolve()
    })
  }

  deque() {
    return new Promise((resolve, reject) => {
      this.next()

      this._log('Deque audio');
      this.emit(PlayerEventTypes.DEQUE);
      resolve()
    })
  }

  play() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.playVideo()

        this._log('Play audio');
        this.emit(PlayerEventTypes.PLAY);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  playQueue() {
    return this.play()
  }

  playUrl(url) {
    return this.emptyQueue()
    .then(() => {
      return this.enqueue(url)
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.stopVideo()
      }

      this._log('Stop audio');
      this.emit(PlayerEventTypes.STOP);
      resolve()
    })
  }

  pause() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.pauseVideo()
      }

      this._log('Pause audio');
      this.emit(PlayerEventTypes.PAUSE);
      resolve()
    })
  }

  replay() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.seekTo(0)
        this.play()

        this._log('Replay audio');
        this.emit(PlayerEventTypes.REPLAY);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  next() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.nextVideo()

        this._log('Next audio');
        this.emit(PlayerEventTypes.NEXT);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  previous() {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._player.previousVideo()

        this._log('Previous audio');
        this.emit(PlayerEventTypes.PREVIOUS);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  setPlaybackRate(rate) {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._playbackRate = this._playbackRateScale(rate)

        this._player.setPlaybackRate(this._playbackRate)

        this._log(`Set playback rate: ${this._playbackRate}`);
        this.emit(PlayerEventTypes.PLAYBACK_RATE, this._playbackRate);

        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      if (this._player) {
        this._volume = this._volumeScale(volume)

        this._player.setVolume(this._volume)

        this._log(`Set volume: ${this._volume}`);
        this.emit(PlayerEventTypes.VOLUME, this._volume);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  static get EventTypes() {
    return PlayerEventTypes
  }
}

module.exports = YoutubePlayer
