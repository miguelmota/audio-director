const EventEmitter = require('events')
const qs = require('qs')
const {scaleLinear} = require('d3-scale')

const PlayerEventTypes = require('./constants/PlayerEventTypes')

class YoutubePlayer extends EventEmitter {
  constructor() {
    super()

    this._player = null

    this._playbackRate = 1
    this._playbackRateScale = scaleLinear()
    .domain([0.75, 2])
    .range([0.75, 2])
    .clamp(true)

    this._volume = 100 // scaled
    this._maxVolume = 100 // scaled
    this._volumeScale = scaleLinear()
    .domain([0, 1])
    .range([0, this._maxVolume])
    .clamp(true)
    this._maxVolumeScale = scaleLinear()
    .domain([0, 1])
    .range([0, 100])
    .clamp(true)

    this._isApiReady = false
    this.isReady = false

    this.random = false
    this.repeat = false

    if (!window.onYouTubeIframeAPIReady) {
      const tag = document.createElement('script')

      tag.src = 'https://www.youtube.com/iframe_api'

      const firstScriptTag = document.getElementsByTagName('script')[0]

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = () => {
      this._onYoutubeApiReady()
    }

    // if already api loaded
    if (window.YT) {
      this._onYoutubeApiReady()
    }
  }

  _destroyPlayer() {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.destroy) {
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

      if (window.YT) {
        this._player = new window.YT.Player(this._playerEl.id, {
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
      }
    })
  }

  _onYoutubeApiReady() {
    this._isApiReady = true;
  }

  _onPlayerReady(event) {
    this.setPlaybackRate(this._playbackRate)
    this.setVolume(this._volume)

    this.isReady = true
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

      this._log('Empty queue');
      this.emit(PlayerEventTypes.EMPTY_QUEUE);

      resolve()
    })
  }

  enqueue(url) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(url)) {
        url = url[0]
      }

      const query = qs.parse(url.replace(/.*\?/gi, ''))
      const videoId = query.v
      const playlistId = query.list

      if (!videoId) {
        return reject(new Error('videoId not found'))
      }

      this._log('Enqueue audio');
      this.emit(PlayerEventTypes.ENQUEUE);

      if (this._isApiReady) {
        return this._setPlayer({
          videoId,
          playlistId
        })
      } else {
        setTimeout(() => {
          this._setPlayer({
            videoId,
            playlistId
          })
          .then(() => resolve())
          .catch(() => reject())
        }, 1e3)
      }
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
      if (this._player && this._player.playVideo) {
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
      if (this._player && this._player.stopVideo) {
        this._player.stopVideo()
      }

      this._log('Stop audio');
      this.emit(PlayerEventTypes.STOP);
      resolve()
    })
  }

  pause() {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.pauseVideo) {
        this._player.pauseVideo()
      }

      this._log('Pause audio');
      this.emit(PlayerEventTypes.PAUSE);
      resolve()
    })
  }

  replay() {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.seekTo) {
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
      if (this._player && this._player.nextVideo) {
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
      if (this._player && this._player.previousVideo) {
        this._player.previousVideo()

        this._log('Previous audio');
        this.emit(PlayerEventTypes.PREVIOUS);
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  setRandom(enabled) {
    this.random = enabled
    this._log(`Set random: ${enabled}`)
    this.emit(PlayerEventTypes.RANDOM)
    return Promise.resolve(true)
  }

  setRepeat(enabled) {
    this.repeat = enabled
    this._log(`Set repeat: ${enabled}`)
    this.emit(PlayerEventTypes.REPEAT)
    return Promise.resolve(true)
  }

  hasNext() {
    return Promise.resolve(true)
  }

  hasPrevious() {
    return Promise.resolve(true)
  }

  setPlaybackRate(rate) {
    return new Promise((resolve, reject) => {
      this._playbackRate = this._playbackRateScale(rate)

      if (this._player && this._player.setPlaybackRate) {
        this._player.setPlaybackRate(this._playbackRate)
      }

      this._log(`Set playback rate: ${this._playbackRate}`);
      this.emit(PlayerEventTypes.PLAYBACK_RATE, this._playbackRate);
      resolve()
    })
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      this._volume = this._volumeScale(volume)

      if (this._player && this._player.setVolume) {
        this._player.setVolume(this._volume)
      }

      this._log(`Set volume: ${this._volume}`);
      this.emit(PlayerEventTypes.VOLUME, this._volume);
      resolve()
    })
  }

  setMaxVolume(maxVolume) {
    return new Promise((resolve, reject) => {
      this._maxVolume = this._maxVolumeScale(maxVolume)
      this._volumeScale = scaleLinear()
      .domain([0, 1])
      .range([0, this._maxVolume])
      .clamp(true)

      this.setVolume(this._volume)

      this._log(`Set max volume: ${this._volume}`);
      this.emit(PlayerEventTypes.MAX_VOLUME, this._maxVolume);
      resolve()
    })
  }

  setMuted(enabled) {
    this.muted = !!enabled
  }

  getCurrentAudioBuffer() {
    return Promise.reject('Method not supported with YouTube player.')
  }

  static get EventTypes() {
    return PlayerEventTypes
  }
}

module.exports = YoutubePlayer
